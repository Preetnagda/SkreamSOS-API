const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const signalSchema = new Schema({
    name: String,
    phoneNumber: String,
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        unique: true
    },
    mediaId: {
      type: Schema.Types.ObjectId, 
      ref: 'Media',
      unique: true
    },
    location: {
      type: {
        type: String, 
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    startTime: {
      type: Date,
      default: Date.now
    },
  },
  {
    timestamps: true
  });

  module.exports = mongoose.model('ActiveSignal', signalSchema);