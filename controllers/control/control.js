const {ObjectId} = require('bson');

const { validationResult, Result } = require('express-validator')

const Signal = require('../../models/signals');
const User = require('../../models/user');

exports.getSOSSignal = (req,res,next) => {

    Signal.find({}).then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })

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

