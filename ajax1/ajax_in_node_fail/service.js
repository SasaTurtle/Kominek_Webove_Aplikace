const DbDriver = require('./dbdriver');

class Service {
  constructor(connection) {
    this.dbDriver = new DbDriver(connection);
    this.peopleTable = 'people';
    this.typesTable = 'types';
  }

  async getPeopleList() {
    return await this.dbDriver.select(this.peopleTable, '*');
  }

  async getTypesList() {
    return await this.dbDriver.select(this.typesTable, '*');
  }

  async saveDrinks(drinks) {
    let res = 0;
    const userID = drinks.user[0];

    for (let i = 0; i < drinks.type.length; i++) {
      if (drinks.type[i] === 0) continue;

      const row = [new Date().toISOString().split('T')[0], userID, i + 1];
      res += await this.dbDriver.insertRow(row);
    }

    return res === 0 ? -1 : 1;
  }

  async getSummaryOfDrinks(data) {
    let month = data.month || 0;
    let sql = `
      SELECT types.typ, COUNT(drinks.ID) as count, people.name 
      FROM drinks 
      JOIN people ON drinks.id_people = people.ID 
      JOIN types ON drinks.id_types = types.ID`;

    if (month > 0 && month < 13) {
      sql += ` WHERE MONTH(date) = ${month}`;
    }

    sql += ' GROUP BY types.typ';
    return await this.dbDriver.selectQuery(sql);
  }
}

module.exports = Service;
