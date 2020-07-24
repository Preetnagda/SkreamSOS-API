const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const policeSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  username : {
      type: String,
      required: true,
      unique: true,
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Police', policeSchema);
