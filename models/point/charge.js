const async = require('async');

module.exports = (point, userId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            async.waterfall([
                // 現在のユーザーのポイントを取得する
                (callback) => {
                    const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
                    stmt.get(userId, (error, row) => {
                        if(error) {
                            reject({
                                code: STATUS.SQL_ERROR,
                                error,
                            });
                        } else {
                            callback(null, row.point);
                        }
                    });
                    stmt.finalize();
                },
                // ユーザーのポイントを更新する
                (_point, callback) => {
                    const stmt = db.prepare('UPDATE users SET point = ? WHERE user_id = ?');
                    stmt.run(_point + Number(point), userId, (error) => {
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
                // ポイントログを追加する
                (callback) => {
                    const stmt = db.prepare('INSERT INTO point_logs (action, user_id, charged, charged_by, created_at) VALUES ("charge", ?, ?, "system", DATETIME(CURRENT_TIMESTAMP, "localtime"))');
                    stmt.run(userId, point, (error) => {
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
