const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodSchema = new Schema({
  name: {type: String, required: true, unique: true, trim: true},
  price: {type: Number, default: ""},
  oldPrice: {type: Number, default: ""},
  info: {type: String, default: ""},
  icon: {type: String},
  menu_id: {type: Schema.Types.ObjectId, ref: 'Menu'},
  shop_id: {type: Schema.Types.ObjectId, ref: 'Shop'}
});

module.exports = mongoose.model('Good', goodSchema);
