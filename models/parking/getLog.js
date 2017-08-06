module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const result = [];
            db.each('SELECT * FROM parking_logs', (error, row) => {
                if(error) {
                    reject({
                        code: STATUS.SQL_ERROR,
                        error,
                    });
                } else {
                    result.push({
                        type: `parking.${row.action}`,
                        parkingId: row.parking_id,
                        userId: row.user_id,
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
