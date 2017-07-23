const async = require('async');
const express = require('express');
const router = express.Router();
const model = require('../models');
const moment = require('moment');

/**
 * フラッシュメッセージを送信
 */
router.use((req, res, next) => {
  res.args = {
    flash: {
      type: req.query.flash || null,
      msg: req.query.msg,
    },
    url: req.url,
  };
  next();
});

/**
 * ログインページ
 */
router.get('/login', (req, res) => {
  res.args.redirect = req.query.redirect;
  res.render('login', res.args);
});

router.post('/login', (req, res) => {
  model.login(req.body.userId, req.body.password)
    .then(() => {
      req.session.user = req.body.userId;
      res.redirect(req.body.redirect || '/');
    })
    .catch((err) => {
      if(err.code === STATUS.LOGIN_FAILED) {
        res.redirect('/login?flash=error&msg=ログイン失敗');
      }
      res.redirect('/login?flash=error&msg=システムエラー');
    });
});

/**
 * ログアウト処理
 */
router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
});

/**
 * ログインしていなければ別ページを表示
 */
router.use((req, res, next) => {
  if(!req.session.user) {
    res.render('unauth', res.args);
  }
  res.args.user = {
    id: req.session.user,
  };
  next();
});

router.use((req, res, next) => {
    model.user.getData(req.session.user)
      .then((data) => {
        res.args.user = data;
        next();
      })
      .catch((err) => {
          res.json(err);
      });
});

/**
 * ホーム
 */
router.get('/', (req, res) => {
  async.waterfall([
    // 駐車場情報を取得
    (callback) => {
      model.parking.getData()
        .then((data) => {
          res.args.parkings = data;
          res.args.moment = moment;
          callback();
        })
        .catch((err) => {
          res.json(err);
        });
    },
    // ポイントログを取得
    (callback) => {
      model.log.getData(req.session.user)
        .then((data) => {
          console.log(data)
          res.args.pointLog = data;
          callback();
        })
        .catch((err) => {
          res.json(err);
        });
    },
  ], (error) => {
    if(error) {
      res.json(error);
    }
    res.render('index', res.args);
  });
});

/**
 * 入庫確認
 */
router.get('/parking/:parkingId', (req, res) => {
  model.parking.getData(req.params.parkingId)
    .then((data) => {
      res.args.parking = data;
      res.render('parking', res.args);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
 * 入庫処理
 */
router.post('/parking/:parkingId', (req, res) => {
  model.parking.entry(req.params.parkingId, req.session.user)
    .then(() => {
      res.redirect(`/parking/entry/complete/${req.params.parkingId}`);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
 * 入庫完了
 */
router.get('/parking/entry/complete/:parkingId', (req, res) => {
  res.args.mode = 'entry';
  model.parking.getData(req.params.parkingId)
    .then((data) => {
      res.args.parking = data;
      res.args.time = moment(data.timestamp).format('HH時mm分');
      res.render('complete', res.args);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
 * 出庫確認
 */
router.get('/leave', (req, res) => {
  res.args.mode = 'leave';
  model.parking.getData(res.args.user.parking)
    .then((data) => {
      res.args.parking = data;
      res.render('complete', res.args);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
 * 出庫処理
 */
router.post('/leave', (req, res) => {
  model.parking.leave(req.session.user)
    .then((result) => {
      res.redirect(`/leave/complete/${result.point}`);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
 * 出庫完了
 */
router.get('/leave/complete/:point', (req, res) => {
  res.args.mode = 'leaved';
  res.args.point = req.params.point;
  res.render('complete', res.args);
});

/**
 * チャージ
 */
router.get('/charge', (req, res) => {
    res.render('charge', res.args);
});

/**
 * チャージ処理
 */
router.post('/charge', (req, res) => {
  model.point.charge(req.body.point, req.session.user)
    .then(() => {
      res.redirect(`/charge/complete/${req.body.point}`);
    })
    .catch((err) => {
      res.json(err);
    });
});

/**
 * チャージ完了
 */
router.get('/charge/complete/:point', (req, res) => {
  res.args.mode = 'charge';
  res.args.point = req.params.point;
  res.render('complete', res.args);
});

/**
 * 404
 */
router.use((req, res) => {
  res.render('404', res.args);
});

module.exports = router;
