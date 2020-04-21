const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {type: String, unique: true, trim: true},
  password: {
    type: String,
    set(val) {
      return require('bcryptjs').hashSync(val, 10)
    },
    select: false
  }
});

module.exports = mongoose.model('AdminUser', schema);
