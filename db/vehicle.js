module.exports = (Sequelize, sequelize) => {
    return sequelize.define('vehicles', {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: Sequelize.STRING(50)},
        fleetId: {type: Sequelize.INTEGER}
    });
};