const async = require('async');
const list = require('../parking_list');

module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            async.waterfall([
                (callback) => {
                    db.run('DELETE FROM parkings', (err) => {
                        callback();
                    });
                },
                (callback) => {
                    const stmt = db.prepare('INSERT INTO parkings (name, lat, lng, description, updated_at) VALUES (?, ?, ?, ?, DATETIME(CURRENT_TIMESTAMP, "localtime"))');
                    async.each(list, (item, callback) => {
                        stmt.run(item.name, item.lat, item.lng, item.description, (err) => {
                            callback();
                        });
                    }, () => {
                        stmt.finalize();
                        callback();
                    });
                },
            ]);
        });
    });
};
