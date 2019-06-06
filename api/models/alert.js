const mongoose = require('mongoose');
//create schema that contain the locationt the alert was created.

 /* const AlertLocation = mongoose.Schema({
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            index: '2dsphere',
            required: true
          },
});  */

//create alert schema
const alertSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId , ref: 'User', require: true},
    title: {type: String, require: true},
    importance: String,
    description: {type: String, require: true},
    date: {type: Date, default: Date.now },
   // location: AlertLocation,
});

module.exports = mongoose.model('Alert', alertSchema);