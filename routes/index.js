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


module.exports = router;
