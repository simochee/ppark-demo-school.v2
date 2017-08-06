module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('DELETE FROM users', (error) => {
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    resolve();
                }
            });
        });
    });
};
