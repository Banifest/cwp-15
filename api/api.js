const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const motions = require('./motions');
const vehicles = require('./vehicles');
const fleets = require('./fleets');
const db = require('../index');

const app = express.Router();
app.use(bodyParser.urlencoded({extended: true}));



app.all(/\/motions|\/fleets|\/vehicles/, function (req, res, next) {
    console.log('lol');
    if(req.headers.authorization)
    {
        let auth = req.headers.authorization.toString().substr(7);
        jwt.verify(auth, 'test', (err, decoded)=>
        {
            if(err)
            {
                res.send(403);
            }
            else
            {
                db.managers.findById(decoded.id)
                    .then
                    (query=> { query? req.manager=query: res.send(403); next();});
            }
        });
    }
    else
    {
        res.send(401);
    }
});

app.use('/vehicles', require('./vehicles'));
app.use('/fleets', require('./fleets'));
app.use('/motions', require('./motions'));
app.use('/auth', require('./auth'));

module.exports = app;