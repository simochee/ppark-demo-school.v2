module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log(userId);
            const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
            stmt.get(userId, (error, row) => {
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    if(row) {
                        resolve({
                            userId: row.user_id,
                            parking: row.parking || null,
                            point: row.point,
                        });
                    } else {
                        reject({
                            code: STATUS.USER_NOT_FOUND,
                        });
                    }
                }
            });
            stmt.finalize();
        });
    });
};
