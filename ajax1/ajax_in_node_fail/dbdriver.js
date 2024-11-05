class DbDriver {
    constructor(connection) {
      if (!connection) throw new Error("Connection is null");
      this.connection = connection;
    }
  
    query(sql) {
      return new Promise((resolve, reject) => {
        this.connection.query(sql, (err, result) => {
          if (err) return reject(err);
          resolve(result[0]); // Fetching the first row
        });
      });
    }
  
    select(table, columns = '*') {
      return new Promise((resolve, reject) => {
        const columnList = Array.isArray(columns) ? columns.join(', ') : columns;
        const sql = `SELECT ${columnList} FROM ${table}`;
  
        this.connection.query(sql, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
    }
  
    insertRow(values) {
      if (!Array.isArray(values)) return -1;
  
      const sql = `INSERT INTO drinks VALUES (NULL, ${values.map(v => `'${v}'`).join(', ')})`;
  
      return new Promise((resolve, reject) => {
        this.connection.query(sql, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    }
  
    selectQuery(sql) {
      return new Promise((resolve, reject) => {
        this.connection.query(sql, (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
    }
  }
  
  module.exports = DbDriver;
  