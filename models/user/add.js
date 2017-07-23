const passwordHash = require('password-hash');

module.exports = (userId, password) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt = db.prepare('INSERT INTO users (user_id, password, created_at, updated_at) VALUES (?, ?, DATETIME(CURRENT_TIMESTAMP, "localtime"), DATETIME(CURRENT_TIMESTAMP, "localtime"))');
            stmt.run(userId, passwordHash.generate(password), (error) => {
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
            stmt.finalize();
        });
        db.close();
    });
};
