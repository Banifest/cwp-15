const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('../index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express.Router();
app.use(bodyParser.urlencoded({extended: true}));

app.post('/register', (req, res) =>
{
    res.contentType('application/json');
    if(req.body.email && req.body.password)
    {
        db.managers.create(
            {
                email: `${req.body.email}`,
                password: `${bcrypt.hashSync(req.body.password.toString(), 8)}`
            }
        ).then(() => res.json({status: "OK"}));
    }
    else
    {
        res.json({status: "400"});
    }

});

app.post('/login', (req, res) =>
{
    if(req.body.email && req.body.password)
    {
        db.managers.findAll({where: {email: req.body.email}})
            .then(obj =>
                  {
                      let is_auth = false;
                      for(let iter of obj)
                      {
                          if (bcrypt.compareSync(req.body.password.toString(), iter.password))
                          {
                              is_auth = true;
                              res.send(jwt.sign({id: iter.id, email: iter.email}, 'test', {expiresIn: 300}));
                              break;
                          }
                      }
                      if(!is_auth)
                      {
                          res.send(400)
                      }
                  });
    }
    else
    {
        res.json('{error: 400}')
    }
});

module.exports = app;