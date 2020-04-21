const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {type: String, unique: true, trim: true},
  parent: {type: Schema.Types.ObjectId, ref: 'Category'}
});

module.exports = mongoose.model('Category', schema);
