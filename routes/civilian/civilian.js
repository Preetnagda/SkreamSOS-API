const express = require('express');

const router = express.Router();

const civilianController = require('../../controllers/civilian/civilian');
const { body } = require('express-validator');
const Signals = require('../../models/signals');
const isAuth = require('../../middleware/civilian_isAuth');

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