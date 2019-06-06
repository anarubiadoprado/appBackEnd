const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Alert = require('../models/alert');
const { loginAuth } = require('../auth/check-auth');
const User = require('../models/user');

router.post('/api/createAlert', /*loginAuth*/ (req, res, next) => {
    User.findById(req.body.userId)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                    message: 'Sorry, alert was NOT created. You need to be loged in to create a alert.'
            });
        } 
        const alert = new Alert ({
            _id: new mongoose.Types.ObjectId(),
            user: req.body.userId,
            title: req.body.title,
            importance: req.body.importance,
            description: req.body.description,
            date: req.body.date,
             });
           
            alert.save();
            })
            .then(result => {
                res.status(201).json({
                    message: 'Alert was created',
                    newAlert: {
                        user: result.body.userId,
                        title: result.body.title,
                        importance: result.body.importance,
                        description: result.body.description,
                        date: result.date,
                        _id: result._id,
                        request: {
                            type: 'GET',
                            description: 'See all alerts',
                            url: 'http://localhost:3000/alerts/api/allAlerts'
                            }
                        }
                    });
            })
            .catch(err => {
                res.status(404).json({error: err});
            });
    
});
router.post('/api/createAlert-1', /*loginAuth*/ (req, res, next) => {
    Alert.create(red.body)
    .save()
    
    
});
router.get('/api/allAlerts', loginAuth,  (req, res, next) => {
    Alert.find()
    .select('title importance description date')
    .exec()
    .then(items => {
        const response = {
            count: items.length,
            alert: items.map(item => {
                return {
                    user: item.user,
                    title: item.title,
                    importance: item.importance,
                    description: item.description,
                    date: item.date,
                    _id: item._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/alerts/api/selectAlert/' + item._id
                    }
                  }; 
                 })
                } 
                res.status(200).json({response});
                })
                .catch(err => {
                    res.status(404).json({error:err});
                });
});

router.get('/api/selectAlert/:alertId', loginAuth,  (req, res, next) => {
    const id = req.params.alertId;
        Alert.findById(id)
        .select('title description importance date')
        .exec()
        .then(item =>{
            res.status(200).json({
                alert: item,
                request: {
                    type: 'PATCH',
                    description: 'You can update the alert with the link bellow',
                    url: 'http://localhost:3000/alerts/api/changeAlert/' + id
                }
            });
        })
        .catch(err => {
            res.status(404).json({error: err});
        });
});

router.patch('/api/changeAlert/:alertId', loginAuth, (req, res, next) => {
    const id = req.params.alertId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Alert.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
            message: 'Alert updated',
            request: {
                type: 'GET',
                description: 'You can see the changes in the link bellow',
                url: 'http://localhost:3000/alerts/selectAlert/' + id
            }
      });  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
});

module.exports = router;