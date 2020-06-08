const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  username: {type: String, unique: true, trim: true},
  password: {
    type: String,
    set(val) {
      return require('bcryptjs').hashSync(val, 10)
    }
  },
  phone: {type: String},
  avatar: {type: String, default: ""}
});

module.exports = mongoose.model('WebUser', schema);
