module.exports = (parkingId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            if(parkingId) {
                // 駐車場IDが指定されている場合は単体のデータを取得
                const stmt = db.prepare('SELECT * FROM parkings WHERE id = ?');
                stmt.get(parkingId, (error, row) => {
                    if(error) {
                        reject({
                            code: STATUS.SQL_ERROR,
                            error,
                        });
                    } else {
                        if(row) {
                            resolve({
                                id: row.id,
                                name: row.name,
                                isParkable: row.is_parkable,
                                lat: row.lat,
                                lng: row.lng,
                                description: row.description,
                                timestamp: row.timestamp,
                            });
                        } else {
                            reject({
                                // 駐車場が見つからない
                            });
                        }
                    }
                });
                stmt.finalize();
            } else {
                // 指定されていない場合はすべてのデータを取得
                const result = [];
                db.each('SELECT * FROM parkings', (error, row) => {
                    if(error) {
                        reject({
                            code: STATUS.SQL_ERROR,
                            error,
                        });
                    } else {
                        result.push({
                            id: row.id,
                            name: row.name,
                            isParkable: row.is_parkable,
                            lat: row.lat,
                            lng: row.lng,
                            description: row.description,
                            timestamp: row.timestamp,
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
            }
        });
    });
};
