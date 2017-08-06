const express = require('express');
const router = express.Router();
const model = require('../models');

router.get('/', (req, res) => {
  res.send(`
    <meta name="viewport" content="width=device-width,initiali-scale=1">
    <h1>プロジェクトへ参加</h1>
    ${req.query.error === 'yes' ? '<p style="color:red">入力内容に誤りがありました。もう一度入力してください</p>' : ''}
    <form action="" method="post">
      <label>ユーザーID：<input type="text" name="userId" placeholder="半角英数字"></label><br>
      <label>誕生日：<input type="number" name="birthday" placeholder="0514（5/14の場合）"><br>
      <button type="submit">送信</button>
    </form>
  `);
});

router.post('/', (req, res) => {
  if(!req.body.userId || !req.body.birthday) {
      res.redirect('/regist?error=yes');
  }
  const userId = req.body.userId;
  const password = `0${req.body.birthday}`.slice(-4);
  model.user.add(userId, password)
    .then(() => {
      res.redirect(`/regist/complete?id=${userId}&pw=${password}`);
    })
    .catch((err) => {
      res.redirect('/regist?error=yes');
    });
});

router.get('/complete', (req, res) => {
  res.send(`
    <meta name="viewport" content="width=device-width,initiali-scale=1">
    <div style="text-align:center">
      <h1>登録完了</h1>
      <p>プロジェクトへご参加いただきありがとうございます</p>
      <br><br>
      <table style="margin:0 auto">
        <tr>
          <th>ユーザーID : </th>
          <td>${req.query.id}</td>
        <tr>
        <tr>
          <th>パスワード : </th>
          <td>${req.query.pw}</td>
        </tr>
      </table>

      <br><br><hr><br><br>

      <a href="/">トップページへ</a>
    </div>
  `);
});

module.exports = router;
