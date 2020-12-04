const {ObjectId} = require('bson');

const { validationResult, Result } = require('express-validator')

const io = require('./../../socket');
const Signal = require('../../models/signals');
const User = require('../../models/user');
const Media = require('../../models/media');



exports.postSOSSignalImage = (req,res,next) => {

    Media.findOneAndUpdate(
        {userId: req.userId},
        { $push: { images: req.file.buffer } },
        {
            upsert:true,
        },
        (err, doc) => {
            if(err){
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            }
            console.log(doc);

            Signal.findOneAndUpdate(
                {userId : req.userId},
                { mediaId: doc._id },
                (err,success) => {
                    if(err){
                        if(!err.statusCode){
                            err.statusCode = 500;
                        }
                        next(err);
                    }
                    res.status(200).json({message: "Image Recieved"});
                }
            );
        }
    )
    res.status(500);
}

exports.postSOSSignal = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res
            .status(422)
            .json({
                message:"Invalid Input",
                errors : errors.array()
            });
    }
    const type = req.body.type;
    const coordinates = req.body.coordinates;
    let signal;

    User.findOne({_id : ObjectId(req.userId)})
        .then(user => {
            signal = Signal.findOneAndUpdate(
                {userId : req.userId},
                {
                    name : user.name,
                    phoneNumber : user.phoneNumber,
                    location:{
                        type: type,
                        coordinates: coordinates,
                    },
                    $setOnInsert: {startTime: Date.now()}
                },
                {
                    upsert: true,
                    new: true
                },
                (err , doc) => {
                    if(err){
                        if(!err.statusCode){
                            err.statusCode = 500;
                        }
                        next(err);
                    }
                    io.getIO().emit('signal' , { action: 'create', doc: doc });
                    res.json({message : "Distress Signal Recieved", doc: doc});
                }
            )
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deletesosSignal = (req, res, next) => {
    Signal.deleteOne({userId: req.userId})
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



// try{
//     printSignals(req.userId,type,coordinates).then(aggregationResults => {
//         aggregationResults.forEach(data => {
//             console.log(data)
//         });
//     });
    
// }
// catch (e){
//     throw e;
// }


// async function printSignals(userId,type,coordinates){
//     const pipeline = [
//         {
//             $match : {
//                 _id: ObjectId(userId)
//             }
//         },
//         {
//             $addField : {
//                 location : {
//                     type: type,
//                     coordinates: coordinates
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id : 0,
//                 name: 1,
//                 phoneNumber: 1
//             }
//         },
//         {
//             $limit:1
//         },
        
//     ]

//     const aggCursor = User.aggregate(pipeline);
//     let aggregationResults = await aggCursor;
//     return aggregationResults;
// }
