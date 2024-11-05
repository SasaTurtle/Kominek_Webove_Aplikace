const mysql = require('mysql');
const config = require('./config');

const connection = mysql.createConnection(config.db);

class DbDriver {
  query(sql, params) {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }
}

module.exports = new DbDriver();
