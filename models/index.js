const sqlite3 = require('sqlite3');
global.db = new sqlite3.Database(`${__dirname}/db.sqlite3`);

const login = require('./login');
const parking = require('./parking');
const point = require('./point');
const user = require('./user');

module.exports = {
    login,
    parking,
    point,
    user,
};
