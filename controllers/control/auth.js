const { validationResult, Result } = require('express-validator')
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Police = require('../../models/police');
// const { use } = require('../routes/auth');

exports.postpoliceLogin = (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    let loadedpolice;
    Police.findOne({username : username})
        .then(police => {
            if(!police){
                const error = new Error('Username not Found');
                error.statusCode = 401;
                throw error;
            }
            loadedpolice = police;
            return bcrypt.compare(password, police.password);
        })
        .then(isEqual => {
            if(!isEqual){
                const error = new Error('Wrong Password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    username: username,
                    policeId: loadedpolice._id.toString()
                },
                'secretsuperkey',
                // {expiresIn: '1h'}
            );
            res.status(200).json({token:token, policeId: loadedpolice._id.toString()}); 

        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });


}

exports.postPoliceSignup = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res
            .status(422)
            .json({
                message:"Invalid Inputs",
                errors : errors.array()
            });
    }

    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password,12)
        .then(hashedPassword => {

            const police = new Police({
                name: name,
                password: hashedPassword,
                username: username
            });
            police.save().then(result => {
                res.status(201).json({ message : 'Police User Created!', userId: result._id})
            })
        })

        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });


}