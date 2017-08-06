module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('DELETE FROM point_logs', (error) => {
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
