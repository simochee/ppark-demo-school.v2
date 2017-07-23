module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            if(userId) {
                // ユーザーIDが指定されている場合は単体のデータを取得
                const result = [];
                const stmt = db.prepare('SELECT * FROM point_logs WHERE user_id = ? ORDER BY created_at DESC');
                stmt.each(userId, (error, row) => {
                    if(error) {
                        reject({
                            code: STATUS.SQL_ERROR,
                            error,
                        });
                    } else {
                        result.push({
                            action: row.action,
                            charged: row.charged,
                            chargedBy: row.charged_by,
                            timestamp: row.created_at,
                        });
                    }
                }, (error) => {
                    if(error) {
                        reject({
                            code: STATUS.SQL_ERROR,
                            error,
                        });
                    } else {
                        resolve(result);
                    }
                });
                stmt.finalize();
            } else {
                reject({
                    code: null,
                });
            }
        });
    });
};
