const express = require('express');
const router = express.Router();
const Exhibit = require('../models/Exhibit');

// GET all exhibits
router.get('/', async (req, res) => {
  const exhibits = await Exhibit.find();
  res.json(exhibits);
});

// POST a new exhibit
router.post('/', async (req, res) => {
  const { title, description, modelUrl, audioUrl } = req.body;
  const newExhibit = new Exhibit({ title, description, modelUrl, audioUrl });
  await newExhibit.save();
  res.json({ message: 'Exhibit added!' });
});

module.exports = router;