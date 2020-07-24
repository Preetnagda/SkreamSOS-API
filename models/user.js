const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber : {
      type: String,
      required: true,
      unique: true,
  },
  isLoggedIn: {
      type: Boolean,
      required: false
  }
});

module.exports = mongoose.model('User', userSchema);
