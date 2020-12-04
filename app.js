

const express = require('express');

const socketioJwt   = require('socketio-jwt');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const civAuthRoutes = require('./routes/civilian/auth');
const civRoutes = require('./routes/civilian/civilian');

const controlAuthRoutes = require('./routes/control/auth');
const controlRoutes = require('./routes/control/control');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const mongoURI = 'mongodb://skreamSOSAPI:NeyMnZRCe1jVAY1R@mflix-shard-00-00.2kbfl.mongodb.net:27017,mflix-shard-00-01.2kbfl.mongodb.net:27017,mflix-shard-00-02.2kbfl.mongodb.net:27017/skreamSOS?ssl=true&replicaSet=mflix-shard-0&authSource=admin&retryWrites=true&w=majority';

const crypto = require('crypto');

const path = require('path');
const { connect } = require('http2');

const app = express();

// const storage = new GridFsStorage({
//     url:mongoURI,
//     file: (req,file) => {
//         return new Promise((resolve,reject) => {
//             crypto.randomBytes(16,(err,buff)=>{
//                 if(err){
//                     return reject(err);
//                 }
//                 const filename = buf.toString('hex') + path.extname(file.originalname);
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'uploads'
//                 };
//                 resolve(fileInfo);
//             });
//         });
//     }
// });


app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    
    next();
});
app.use(bodyParser.json());

app.use('/civilian/auth',civAuthRoutes);
app.use('/civilian',civRoutes);
app.use('/control/auth',controlAuthRoutes);
app.use('/control',controlRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ error : err})
})

// mongodb://skreamSOSAPI:NeyMnZRCe1jVAY1R@mflix-shard-00-00.2kbfl.mongodb.net:27017,mflix-shard-00-01.2kbfl.mongodb.net:27017,mflix-shard-00-02.2kbfl.mongodb.net:27017/skreamSOS?ssl=true&replicaSet=mflix-shard-0&authSource=admin&retryWrites=true&w=majority
let gfs;

mongoose.connect(mongoURI)
    .then(result => {
        const server = app.listen(process.env.PORT || 8000);
        const io = require('./socket').init(server);

        // console.log(result.connection.db);

        // gfs= new mongoose.mongo.GridFSBucket(result.connection.db, {
        //     bucketName: "uploads"
        // });
        
        io.sockets
        .on('connection', socketioJwt.authorize({ 
            secret: 'secretsuperkey',
            timeout: 15000 // 15 seconds to send the authentication message
        }))
        .on('authenticated', (socket) => {
            //this socket is authenticated, we are good to handle more events from it.
            console.log("== websocket client authenticated ==");
        });
    })
    .catch(err => {
        console.log(err);
    });

