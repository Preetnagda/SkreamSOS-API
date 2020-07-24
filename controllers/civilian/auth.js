const { validationResult, Result } = require('express-validator')
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../../models/user');
// const { use } = require('../routes/auth');

exports.postuserLogin = (req,res,next) => {
    const phoneNumber = req.body.phoneNumber;
    User.findOne({phoneNumber : phoneNumber})
        .then(user => {
            if(!user){
                const error = new Error('Phone Number not Found');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            const token = jwt.sign(
                {
                    phoneNumber: phoneNumber,
                    userId: loadedUser._id.toString()
                },
                'secretsuperkey'
            );
            res.status(200).json({token:token, userId: loadedUser._id.toString()}); 
       
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });


}

exports.postUserSignup = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res
            .status(422)
            .json({
                message:" Validation Failed",
                errors : errors.array()
            });
    }
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const user = new User({
        name: name,
        phoneNumber: phoneNumber,

    });
    user.save().then(result => {
        res.status(201).json({ message : 'User Created!', userId: result._id})
    }
    )
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}