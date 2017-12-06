const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('../index');

const app = express.Router();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/readall', (req, res) =>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.fleets.findAll()
            .then(query => res.json(query));
    }
    else
    {
        res.json({status: 403});
    }
});

app.get('/read', (req, res) =>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.fleets.findById(req.headers.id)
            .then(query => query? res.json(query): res.json({error: 400}));
    }
    else
    {
        db.fleets.findById(req.manager.fleetId)
            .then(query => query? res.json(query): res.json({error: 400}));
    }
});

app.post('/create', (req, res)=>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.fleets.create
        (
            {
                name: req.body.name
            }
        ).then((fleet)=> res.json(fleet));
    }
    else
    {
        res.json({status: 403});
    }
});

app.post('/update', (req, res)=>
{
    if(req.manager.super)
    {

        res.contentType('application/json');
        db.fleets.update({name: req.body.name}, {where: {id: req.body.id}})
            .then((fleet) => db.fleets.findById(req.body.id).then(
                query => query ? res.json(query) : res.json('{error: 400}')))
    }
    else
    {
        res.json({status: 403});
    }
});

app.post('/delete', (req, res)=>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.fleets.findById(req.body.id)
            .then(fleet => db.fleets.destroy({where: {id: req.body.id}})
                .then(query => query ? res.json(fleet) : res.json('{error: 400}')));
    }
    else
    {
        res.json({status: 403});
    }
});

module.exports = app;