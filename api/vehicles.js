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
        db.vehicles.findAll({where: {id: req.headers.id, fleetId: req.manager.fleetId}})
            .then(query =>
                  {
                      if(query)
                      {
                          res.json(query[0])
                      }
                      else
                      {
                          res.json({error: 400});
                      }
                  })
            .catch(query =>  res.json({error: 400}));
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
        db.vehicles.findAll({where: {id: req.body.id, fleetId: req.manager.fleetId}})
            .then(query =>
                  {
                      if(query.length)
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
                          res.json('{error: 400}')
                      }
                  });
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
        db.vehicles.findAll({where: {id: req.body.id, fleetId: req.manager.fleetId}})
            .then(query =>
                  {
                      if(query.length)
                      {
                          db.vehicles.destroy({where: {id: req.body.id}})
                              .then(query => query?  res.json(vehicle): res.json('{error: 400}'));
                      }
                      else
                      {
                          res.json('{error: 400}');
                      }
                  });
    }

});

module.exports = app;
