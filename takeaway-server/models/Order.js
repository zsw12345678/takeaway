const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'WebUser'},
  shop_id: {type: Schema.Types.ObjectId, ref: 'Shop'},
  shop_avatar: {type: String},
  shop_name: {type: String},
  address_id: {type: Schema.Types.ObjectId, ref: 'Address'},
  total_price: {type: Number, default: ""},
  goods: {type: Array},
  goodStr: {type: String},
  create_time: {type: Number},
  status: {type: Number, default: 0},
  pay_time: {type: Number},
  has_commen: {type: Boolean, default: false}
});

module.exports = mongoose.model('Order', goodSchema);
