const passwordHash = require('password-hash');

module.exports = (userId, password) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
            stmt.get(userId, (error, row) => {
                // SQL Error
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    if(row) {
                        if( passwordHash.verify(password, row.password) ) {
                            resolve({
                                code: STATUS.SUCCESS,
                            });
                        } else {
                            // Invalid password
                            reject({
                                code: STATUS.LOGIN_FAILED,
                            });
                        }
                    } else {
                        // User not found
                        reject({
                            code: STATUS.LOGIN_FAILED,
                        });
                    }
                }
            });
            stmt.finalize();
        });
    });
};
