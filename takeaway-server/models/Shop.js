const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {type: String, required: true, unique: true, trim: true},
  avatar: {type: String, default: ""},
  categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
  deliveryMode: {type: String, default: "迅捷专送"},
  deliveryTime: {type: Number, default: 0},
  minPrice: {type: Number, default: 0},
  deliveryPrice: {type: Number, default: 0},
  bulletin: {type: String, default: ""},
  score: {type: Number, default: 0},
  serviceScore: {type: Number, default: 0},
  foodScore: {type: Number, default: 0},
  rankRate: {type: Number, default: 0},
  sellCount: {type: Number, default: 0},
  ratingCount: {type: Number, default: 0},
  phone: {type: String},
  address: {type: String},
  openTime: {type: Array},
  distance: {type: Number, default: 0}
});

module.exports = mongoose.model('Shop', schema);
