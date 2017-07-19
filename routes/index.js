const express = require('express');
const router = express.Router();

/**
 * ログインページ
 */
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  req.session.user = {
    id: 1,
  };
  res.redirect('/');
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
    res.render('unauth');
  }
  res.args = {
    user: {
      id: req.session.user,
    },
  };
  next();
});

/**
 * ホーム
 */
router.get('/', (req, res) => {
  res.render('index', res.args);
});

/**
 * 入庫確認
 */
router.get('/parking/:parkingId', (req, res) => {
  res.render('parking', res.args);
});

/**
 * チャージ
 */
router.get('/charge', (req, res) => {
    res.render('charge', res.args);
});

module.exports = router;
