const express = require('express');

const router = express.Router();

const authController = require('../../controllers/control/auth');
const { body } = require('express-validator');
const Police = require('../../models/police');

router.post('/signup', 
    [
        body('username')
            .exists(),
        body('username')
            .custom((value, {req}) => {
                return Police.findOne({username : value}).then(userDoc => {
                    if(userDoc){
                        return Promise.reject('Username Exists');
                    }
                });
            }),
        body('password')
            .exists(),
        body('name')
            .exists()
    ],
    authController.postPoliceSignup
);

router.post('/login',authController.postpoliceLogin);

module.exports = router;