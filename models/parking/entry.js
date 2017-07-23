const async = require('async');

module.exports = (parkingId, userId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            async.waterfall([
                // 排他処理
                (callback) => {
                    const stmt = db.prepare('SELECT * FROM parkings WHERE id = ?');
                    stmt.get(parkingId, (error, row) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            if(row.is_parkable == 1) {
                                callback();
                            } else {
                                reject({
                                    code: STATUS.PARKING_USING,
                                });
                            }
                        }
                    });
                },
                // parkingsへの更新
                (callback) => {
                    const stmt = db.prepare('UPDATE parkings SET is_parkable = 0, timestamp = DATETIME(CURRENT_TIMESTAMP, "localtime") WHERE id = ?');
                    stmt.run(parkingId, (error) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback();
                        }
                    });
                    stmt.finalize();
                },
                // usersへの更新
                (callback) => {
                    const stmt = db.prepare('UPDATE users SET parking = ? WHERE user_id = ?');
                    stmt.run(parkingId, userId, (error) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback();
                        }
                    });
                    stmt.finalize();
                },
                // parking_logsへの更新
                (callback) => {
                    const stmt = db.prepare('INSERT INTO parking_logs (user_id, parking_id, created_at) VALUES (?, ?, DATETIME(CURRENT_TIMESTAMP, "localtime"))');
                    stmt.run(userId, parkingId, (error) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback();
                        }
                    });
                    stmt.finalize();
                },
            ], (error) => {
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    resolve({
                        code: STATUS.SUCCESS,
                    });
                }
            });
        });
    });
};
