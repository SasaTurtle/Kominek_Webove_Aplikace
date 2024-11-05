const express = require('express');
const bodyParser = require('body-parser');
const Service = require('./service');
const connection = require('./db');

const app = express();
app.use(bodyParser.json());

const service = new Service(connection);

app.get('/cmd/:cmd', async (req, res) => {
  const { cmd } = req.params;

  try {
    switch (cmd) {
      case 'getPeopleList':
        res.json(await service.getPeopleList());
        break;
      case 'getTypesList':
        res.json(await service.getTypesList());
        break;
      case 'getSummaryOfDrinks':
        res.json(await service.getSummaryOfDrinks(req.query));
        break;
      case 'saveDrinks':
        res.json(await service.saveDrinks(req.body));
        break;
      default:
        res.json({ msg: 'err' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
