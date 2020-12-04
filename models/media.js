const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    signalId: {
        type: Schema.Types.ObjectId, 
        ref: 'ActiveSignal',
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        unique: true
    },
    images : [
        {
          type: Buffer,
          require: false
        }
      ]
});

module.exports = mongoose.model('Media', mediaSchema);