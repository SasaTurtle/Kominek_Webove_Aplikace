const express = require('express');
const router = express.Router();
const service = require('./service');


router.get('/people', (req, res) => {
  service.getPeopleList()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});


router.post('/saveDrinks', (req, res) => {
  service.saveDrinks(req.body)
    .then(() => res.status(200).json({ message: 'Drinks saved successfully' }))
    .catch(err => res.status(500).json({ error: err.message }));
});


router.get('/getDrinkTypes', (req, res) => {
  service.getDrinkTypes()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
