const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const motions = require('./motions');
const vehicles = require('./vehicles');
const fleets = require('./fleets');

const app = express.Router();
app.use(bodyParser.urlencoded({extended: true}));

app.use('/vehicles', require('./vehicles'));
app.use('/fleets', require('./fleets'));
app.use('/motions', require('./motions'));
app.use('/auth', require('./auth'));

//app.all('/auth')

app.all('/*', (req, res, next) =>
{
    fs.appendFile('log.log', `{"data":${new Date()},\n "params":${JSON.stringify(req.query)},\n "path":${req.originalUrl}}\n\n\n`);
    next();
});

module.exports = app;