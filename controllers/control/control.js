const {ObjectId} = require('bson');

const { validationResult, Result } = require('express-validator')

const Signal = require('../../models/signals');
const User = require('../../models/user');
const Media = require('../../models/media');

exports.getSOSSignal = (req,res,next) => {

    Signal.find({}).then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })

}

exports.getSOSSignalImages = (req,res,next) => {
    console.log(req.body.signalUserId);

    Media.findOne(
        {userId: req.body.signalUserId},
        (err,doc)=> {
            if(err){
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            }
            res.status(200).json({doc: doc});
        }

    )

}

exports.deletesosSignal = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res
            .status(422)
            .json({
                message:"Invalid Input",
                errors : errors.array()
            });
    }
    Signal.deleteOne({userId: ObjectId(req.body.userId)})
        .then(signal => {
            if(signal.n == 1){
                res.status(200).json({message: "Signal Deleted"})
            }
            else{
                res.status(400).json({message: "signal Does not exists"})
            }
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
}

