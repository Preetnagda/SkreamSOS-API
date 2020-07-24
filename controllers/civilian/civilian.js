const {ObjectId} = require('bson');

const { validationResult, Result } = require('express-validator')

const Signal = require('../../models/signals');
const User = require('../../models/user');

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

    User.findOne({_id : ObjectId(req.userId)})
        .then(user => {
            Signal.updateOne(
                {userId : req.userId},
                {
                    name : user.name,
                    phoneNumber : user.phoneNumber,
                    location:{
                        type: type,
                        coordinates: coordinates,
                    }
                },
                {
                    upsert: true
                }
            ).then(result => {
                res.json({message : "Distress Signal Recieved"});
            })
            .catch(err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })  
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
            if(signal.n >= 1){
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
