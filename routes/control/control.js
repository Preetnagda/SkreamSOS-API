const express = require('express');

const router = express.Router();

const controlController = require('../../controllers/control/control');
const { body } = require('express-validator');
const Signals = require('../../models/signals');
const isAuth = require('../../middleware/control_isAuth');

router.get('/sosSignal',isAuth, controlController.getSOSSignal);

router.delete('/sosSignal',isAuth,[body('userId').exists()],controlController.deletesosSignal);

module.exports = router;