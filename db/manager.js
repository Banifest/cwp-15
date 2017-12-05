module.exports = (Sequelize, sequelize) => {
    return sequelize.define('managers', {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        email: {type: Sequelize.STRING(50), validate: {isEmail: true}},
        password: {type: Sequelize.STRING(50)},
        super: {type: Sequelize.BOOLEAN}
    });
};