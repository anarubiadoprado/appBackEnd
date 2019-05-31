const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //userImage: String,
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {type: String,
          require: true,
          unique: true,
          match: /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/},
    password: {type: String, require: true}
});

module.exports = mongoose.model('User', userSchema);