const express = require('express');

const router = express.Router();

const authController = require('../../controllers/civilian/auth');
const { body } = require('express-validator');
const User = require('../../models/user');

router.post('/signup', 
    [
        body('phoneNumber')
            .isMobilePhone("en-IN",{strict: true})
            .withMessage("Enter a valid Phone Number")
            .custom((value, {req}) => {
                return User.findOne({phoneNumber : value}).then(userDoc => {
                    if(userDoc){
                        return Promise.reject('Phone Number Exists');
                    }
                });
            }),
        body('name')
            .exists()
    ],
    authController.postUserSignup
);

router.post('/login',authController.postuserLogin);

module.exports = router;