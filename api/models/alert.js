const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId , ref: 'User', require: true},
    title: {type: String, require: true},
    importance: String,
    description: {type: String, require: true},
    date: Date
});

module.exports = mongoose.model('Alert', alertSchema);