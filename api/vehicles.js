const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('../index');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const app = express.Router();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/readall', (req, res) =>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.vehicles.findAll()
            .then(query => res.json(query));
    }
    else
    {
        db.vehicles.findAll({where: {fleetId: req.manager.fleetId}})
            .then(result=>
                  {
                        res.json(result)
                  })
    }
});

app.get('/read', (req, res) =>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.vehicles.findById(req.headers.id)
            .then(query => query? res.json(query): res.json({error: 400}));
    }
    else
    {
        db.fleets.findAll({where: {id: req.headers.id, fleetId: req.manager.fleetId}})
            .then(query => query? res.json(query): res.json({error: 400}));
    }
});

app.post('/create', (req, res)=>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        if(!req.body.name)  res.json({error: 400});
        if(req.body.fleetId)
        {
            db.fleets.findById(req.body.fleetId)
                .then(fleet=>
                      {
                          if(!fleet) res.json({error: 400});
                          db.vehicles.create
                          (
                              {
                                  name: req.body.name,
                                  fleetId: req.body.fleetId
                              }
                          ).then((vehicle)=> res.json(vehicle));
                      })
        }
        else
        {
            if(!req.body.name)  res.json({error: 400});
            else
            {
                db.fleets.findById(req.manager.fleetId)
                    .then(fleet=>
                          {
                              if(!fleet) res.json({error: 400});
                              db.vehicles.create
                              (
                                  {
                                      name: req.body.name,
                                      fleetId: req.manager.fleetId
                                  }
                              ).then((vehicle)=> res.json(vehicle));
                          })
            }
        }
    }
    else
    {
        res.json({status: 403});
    }

});

app.post('/update', (req, res)=>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.vehicles.update(
            {
                name: req.body.name,
                fleetId: req.body.fleetId
            }, {where: {id: req.body.id}})
            .then((vehicle)=> db.vehicles.findById(req.body.id).then(query => query?  res.json(query): res.json('{error: 400}')))
    }
    else
    {
        db.fleets.findAll({where: {id: res.headers.id, fleetId: req.manager.fleetId}})
            .then(query =>
                  {
                      query ? res.json(query) : res.json({error: 400})
                  });
        res.json({status: 403});
    }
    res.contentType('application/json');
});

app.post('/delete', (req, res)=>
{
    res.contentType('application/json');
    if(req.manager.super)
    {
        db.vehicles.findById(req.body.id)
            .then(vehicle => db.vehicles.destroy({where: {id: req.body.id}})
                .then(query => query?  res.json(vehicle): res.json('{error: 400}')));
    }
    else
    {
        res.json({status: 403});
    }

});

module.exports = app;
