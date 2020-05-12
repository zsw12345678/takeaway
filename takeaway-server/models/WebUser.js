const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {type: String, unique: true, trim: true},
  pwd: {type: String, trim: true},
  phone: {'type': String}
});

module.exports = mongoose.model('WebUser', schema);
