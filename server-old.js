'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Registration = require('./data/registration');
const modelsdb = require('./controller/controllers')
const app = express();
/*
const mongo = require('mongodb').MongoClient;
const url = "mongodb+srv://db_user:3671Jose@cluster0-h6sr1.mongodb.net/test?retryWrites=true";
const databaseName = 'test';

mongoose.connect(url, (err) => {
  console.log('Mongoose connected.');


});


mongo.connect(url, { useNewUrlParser: true })
.then((client) => {
  const db = client.db(databaseName);
*/

app.set('port', process.env.PORT || 4000);
app.use(express.static('public')); // set location for static files
app.use(bodyParser.urlencoded({extended: true})); // parse form submissions


 	 app.post('/registration', (req, res) => {
 	 	console.log(req.body);

		const registration = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: req.body.password
		};
		const result = Registration.update(registration);
		res.status(201).send(result);
		console.log(registration);	
	});


	app.get('/registration', (req, res) => {
	   	const allRegistration = Registration.find({});
	   	res.status(201).send(allRegistration);
	   	console.log(allRegistration);
	 });


		// send plain text response
	app.get('/', (req, res) => {
		 res.type('text/plain');
		 res.send('Home page');
	});


	// define 404 handler
	app.use( (req,res) => {
		 res.type('text/plain'); 
		 res.status(404);
		 res.send('404 - Not found');
	});
	

app.listen(app.get('port'), () => {
 console.log('Express started'); 
});