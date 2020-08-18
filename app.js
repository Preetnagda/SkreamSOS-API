

const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const civAuthRoutes = require('./routes/civilian/auth');
const civRoutes = require('./routes/civilian/civilian');

const controlAuthRoutes = require('./routes/control/auth');
const controlRoutes = require('./routes/control/control');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    
    next();
});


app.use('/civilian/auth',civAuthRoutes);
app.use('/civilian',civRoutes);
app.use('/control/auth',controlAuthRoutes);
app.use('/control',controlRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ error : err})
})


mongoose.connect('mongodb+srv://skreamSOSAPI:NeyMnZRCe1jVAY1R@mflix-2kbfl.mongodb.net/skreamSOS?retryWrites=true&w=majority')
    .then(result => {
        app.listen(process.env.PORT || 8000);
    })
    .catch(err => {
        console.log(err);
    });

