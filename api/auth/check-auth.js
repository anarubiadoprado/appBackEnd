const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const loginAuth = (req, res, next) => {
    try{
        const token =  req.headers.authorization.split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
     } catch (error) {
        return res.status(401).json({message: 'Auth Failed'});
    }
}

const adminAuth = (req, res, next) => {
    try{
        const token =  req.headers.authorization.split(' ')[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
    } finally{
    User.find({role: req.body.role}) 
    .exec()
    .then(user => {
        if(user.role === 'admin'){
            return true;
        } else {
            return error;
        }
    });
        
   }
}




module.exports = {
    loginAuth,
    adminAuth
} 