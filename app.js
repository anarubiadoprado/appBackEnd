const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');
const cred = require('./credentials');

//enventually process.env.MONGO_ATLAS_PW + '...'
mongoose.connect(cred.connectionString, {
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

const userRoutes = require('./api/routes/users');
const alertRoutes = require('./api/routes/alerts');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyPaser.urlencoded({extended: false}));
app.use(bodyPaser.json());
//handle cors error/access to data when client and server url are differen
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Conten-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 
        'PUT,POST, PATCH, DELETE, GET');
        return res.status(200),json({});
    }
    next();
});

//Routes which should handle request
app.use('/users', userRoutes);
app.use('/alerts', alertRoutes);
 
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;