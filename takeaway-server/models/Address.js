const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {type: String},
  user_id: {type: Schema.Types.ObjectId, ref: 'WebUser'},
  tel: {type: String},
  city: {type: String},
  country: {type: String},
  county: {type: String},
  areaCode: {type: String},
  addressDetail: {type: String},
  postalCode: {type: String}
});

module.exports = mongoose.model('Address', schema);
