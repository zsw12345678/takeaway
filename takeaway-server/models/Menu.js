const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true, trim: true},
  shop_id: {type: Schema.Types.ObjectId, ref: 'Shop'}
});

module.exports = mongoose.model('Menu', menuSchema);
