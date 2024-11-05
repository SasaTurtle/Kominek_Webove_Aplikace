const dbDriver = require('./dbdriver');

class Service {
  constructor() {
    this.db = dbDriver;
  }

  async getPeopleList() {
    const query = 'SELECT ID, name FROM people';
    return this.db.query(query);
  }

  async saveDrinks(drinkData) {
    const query = 'INSERT INTO drinks (date, id_people, id_types) VALUES (?, ?, ?)';
    const promises = drinkData.map(drink => 
      this.db.query(query, [drink.date, drink.id_people, drink.id_types])
    );
    return Promise.all(promises);
  }


  async getDrinkTypes() {
    const query = 'SELECT ID, typ FROM types';
    return this.db.query(query);
  }
}

module.exports = new Service();
