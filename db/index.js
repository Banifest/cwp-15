const Fleet = require('./fleet');
const Motion = require('./motion');
const Vehicle = require('./vehicle');
const Manager = require('./manager');
const Promise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

module.exports = (Sequelize, config)=>
{
    const sequelize = new Sequelize('database', 'username', '',
                                    {
                                        host: 'localhost',
                                        dialect: 'sqlite',
                                        storage: './tracking',
                                        define: {
                                            timestamps: true,
                                            paranoid: true
                                        }
                                    });

    const fleets = Fleet(Sequelize, sequelize);
    const motions = Motion(Sequelize, sequelize);
    const vehicles = Vehicle(Sequelize, sequelize);
    const managers = Manager(Sequelize, sequelize);

    motions.belongsTo(vehicles, {foreignKey: 'vehicleId', targetKey: 'id'});
    vehicles.belongsTo(fleets, {foreignKey: 'fleetsId', targetKey: 'id'});
    managers.belongsTo(vehicles, {foreignKey: 'fleetId', targetKey: 'id'});


    return {
        fleets,
        motions,
        vehicles,
        managers,
        sequelize: sequelize,
        Sequelize: Sequelize
    };
};