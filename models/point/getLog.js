module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const result = [];
            db.each('SELECT * FROM point_logs', (error, row) => {
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    result.push({
                        type: 'point.charge',
                        amount: row.charged,
                        userId: row.user_id,
                        charged: row.charged_by,
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
        });
    });
};
