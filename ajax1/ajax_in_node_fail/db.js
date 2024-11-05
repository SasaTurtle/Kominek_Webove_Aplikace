const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

connection.connect((err) => {
  if (err) {
    console.error('Connection failed: ' + err.stack);
    return;
  }
  console.log('Connected successfully');
});

module.exports = connection;
