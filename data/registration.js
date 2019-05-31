const mongoose = require('mongoose');
const cred = require('../credentials');
const mongo = require('mongodb').MongoClient;


mongoose.connect(cred.connectionString, { dbName: 'test', useNewUrlParser: true });

mongoose.connection.on('open', () => {
  console.log('Mongoose connected.');

});



// define Songs model in JSON key/value pairs
// values indicate the data type of each key
const RegistrationSchema = new mongoose.Schema({
 	firstname: { type: String, required: true },
 	lastname: String,
 	email: String,
	password: String
}); 

module.exports = mongoose.model('Test', RegistrationSchema);
