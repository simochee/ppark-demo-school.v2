const async = require('async');
const express = require('express');
const router = express.Router();
const model = require('../models');
const moment = require('moment');

router.get('/', (req, res) => {
    const result = [];
    async.waterfall([
        // 入出庫関連のログを取得
        (callback) => {
            model.parking.getLog()
                .then((data) => {
                    data.forEach((item) => {
                        result.push(item);
                    });
                    callback();
                })
                .catch((err) => {
                    res.json(err);
                });
        },
        // ポイント関連のログを取得
        (callback) => {
            model.point.getLog()
                .then((data) => {
                    data.forEach((item) => {
                        result.push(item);
                    });
                    callback();
                })
                .catch((err) => {
                    res.json(err);
                });
        },
        // ユーザー関連のログを取得
        (callback) => {
            model.user.getLog()
                .then((data) => {
                    data.forEach((item) => {
                        result.push(item);
                    });
                    callback();
                })
                .catch((err) => {
                    res.json(err);
                });
        },
        // 駐車場データをparking_idの連想配列で取得
        (callback) => {
            const parkings = {};
            model.parking.getData()
                .then((data) => {
                    data.forEach((item) => {
                        parkings[item.id] = item;
                    });
                    callback(null, parkings);
                })
                .catch((err) => {
                    res.json(err);
                });
        },
    ], (error, parkings) => {
        if(error) {
            res.json(error);
        }
        // Timestampで降順にソート
        result.sort((a, b) => {
            if(a.timestamp > b.timestamp) {
                return -1;
            }
            if(a.timestamp < b.timestamp) {
                return 1;
            }
            return 0;
        });
        console.log(result);
        res.render('viewer', {
            data: result,
            moment,
            parkings,
        });
    });
});

module.exports = router;
