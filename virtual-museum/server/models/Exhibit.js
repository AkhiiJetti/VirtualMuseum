const mongoose = require('mongoose');

const ExhibitSchema = new mongoose.Schema({
  title: String,
  description: String,
  modelUrl: String,
  audioUrl: String
});

module.exports = mongoose.model('Exhibit', ExhibitSchema);