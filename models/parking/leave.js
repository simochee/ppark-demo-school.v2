const async = require('async');
const moment = require('moment');

const getData = require('./getData');
const user = require('../user');

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            async.waterfall([
                // usersから入庫中の駐車場を取得
                (callback) => {
                    user.getData(userId)
                        .then((data) => {
                            callback(null, data.parking);
                        })
                        .catch((err) => {
                            reject({
                                code: err.code,
                                error: err.error,
                            });
                        });
                },
                // parkingsから入庫時刻を取得・入庫時間の算出
                (parkingId, callback) => {
                    getData(parkingId)
                        .then((data) => {
                            const entried = data.timestamp;
                            const duration = moment().diff(moment(entried), 'minutes');
                            callback(null, parkingId, duration);
                        })
                        .catch((err) => {
                            reject({
                                code: err.code,
                                error: err.error,
                            });
                        });
                },
                // parkingsへの更新
                (parkingId, duration, callback) => {
                    const stmt = db.prepare('UPDATE parkings SET is_parkable = 1, timestamp = NULL WHERE id = ?');
                    stmt.run(parkingId, (error) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback(null, parkingId, duration);
                        }
                    });
                    stmt.finalize();
                },
                // parking_logsへの更新
                (parkingId, duration, callback) => {
                    const stmt = db.prepare('INSERT INTO parking_logs (action, user_id, parking_id, created_at) VALUES ("leave", ?, ?, DATETIME(CURRENT_TIMESTAMP, "localtime"))');
                    stmt.run(userId, parkingId, (error) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback(null, parkingId, duration);
                        }
                    });
                    stmt.finalize();
                },
                // point_logsへの更新
                (parkingId, duration, callback) => {
                    const stmt = db.prepare('INSERT INTO point_logs (action, user_id, charged, charged_by, created_at) VALUES ("charge", ?, ?, ?, DATETIME(CURRENT_TIMESTAMP, "localtime"))');
                    stmt.run(userId, -duration, `parking:${parkingId}`, (error) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback(null, duration);
                        }
                    });
                    stmt.finalize();
                },
                // usersへの更新
                (duration, callback) => {
                    const stmt = db.prepare('UPDATE users SET parking = -1 WHERE user_id = ?');
                    stmt.run(userId, (error) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback(null, duration);
                        }
                    });
                    stmt.finalize();
                },
            ], (error, point) => {
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    resolve({
                        code: STATUS.SUCCESS,
                        point,
                    });
                }
            });
        });
    });
};
