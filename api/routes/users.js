const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//decide how files will be storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
}); 

/* const fileFilter = (req, file, cd) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cd(null, true);
    }else {
        //could trow a error
        cd(null, false);
    }
}; */
const upload = multer({storage: storage});
//importanting models
const User = require('../models/user');

//upload.single('profileImage')
router.post('/api/registerUser', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then( user => {
        if(user.length >= 1){
            return res.status(409).json({message: 'Sorry, email already exist.'});
        }else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) { 
                 return res.status(500).json({
                     error: err});
              }else{
                 const user = new User ({
                     _id: new mongoose.Types.ObjectId(),
                     // userImage: req.file.path,
                     firstName: req.body.firstName,
                     lastName: req.body.lastName,
                     email: req.body.email,
                     password: hash
                 });
                 user
                 .save()
                 .then(result => {
                     console.log(result);
                     res.status(201).json({
                         message: 'New user was created'});      
                 })
                 .catch(err => {
                     console.log(err);
                     res.status(500).json({error: err});
               });
             }
             }); 
         }
    });
 }); 
router.post('/api/login' , (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({message: 'Auth failed'});
        } 
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({message: 'Auth failed'}); 
            }
            if(result){
               const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, 
                {
                   expiresIn: '1h'   
                }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token 
                });
                    
            }
            res.status(401).json({message: 'Auth failed'}); 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    })
});

router.get('/api/allUsers', (req, res, next)=> {
    User.find()
    .select('firstName lastName email _id userImage')
    .exec()
    .then(items => {
        const response = {
            count: items.length,
            users: items.map( item => {
                return {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: item.email,
                    _id: item._id,
                    userImage: item.userImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/api/selectUser/' + item._id
                    }
                };
            })
        }
       //if(items.length >= 0) { 
        res.status(200).json(response);
      /*  } else {
           res.status(404).json({
               message: 'No entries found'
           });
       } */
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    })
});

router.get('/api/selectUser/:userId', (req, res, next) => {
    const id =  req.params.userId;
    User.findById(id)
        .select('firstName lastName email _id')
        .exec()
        .then(item => {
            if(item) {
             res.status(200).json({
                 user: item,
                 request: {
                    type: 'PATCH',
                    url: 'http://localhost:3000/users/api/changeUser/' + id
                 }
             });
            } else {
                res.status(404).json({
                    message: 'Not valid entry found for provide ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    });  

router.patch('/api/changeUser/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
      res.status(200).json({
            message: 'User updated',
            request: {
                type: 'GET',
                description: 'You can see the changes in the link bellow',
                url: 'http://localhost:3000/users/api/selectUser/' + id
            }
      });  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
    });

router.delete('/api/deleteUser/:userId', (req, res, next) => {
    const id= req.params.userId;
    User.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'We are sad to see you go, your user is deleted.',
            request: {
            type: 'POST',
            //home page of the app 
            url: 'http://localhost:3000/users/api/allUsers' 
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;