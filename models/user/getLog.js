module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const result = [];
            db.each('SELECT * FROM users', (error, row) => {
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    result.push({
                        type: 'user.regist',
                        timestamp: row.created_at,
                        userId: row.user_id,
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
        });
    });
};
