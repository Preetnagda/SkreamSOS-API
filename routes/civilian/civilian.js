const express = require('express');

const router = express.Router();

const civilianController = require('../../controllers/civilian/civilian');
const { body } = require('express-validator');
const Signals = require('../../models/signals');
const isAuth = require('../../middleware/civilian_isAuth');
const multer = require('multer');


const upload = multer({
    limits:{
        fieldSize:100000,
    },
    fileFilter(req,file,cb){
        // console.log(file.originalname);
        if(!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
            return cb(new Error('Incorrect File Format'));
            cb(undefined,true);
    }
    
})

router.post('/sosSignal/media',isAuth,upload.single('image'),civilianController.postSOSSignalImage);

router.post('/sosSignal',isAuth,[
        body('type')
            .equals("Point"),
        body('coordinates')
            .exists()
    ],
    civilianController.postSOSSignal
);

router.delete('/sosSignal',isAuth,civilianController.deletesosSignal);



module.exports = router;