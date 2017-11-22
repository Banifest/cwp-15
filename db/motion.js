module.exports = (Sequelize, sequelize) => {
    return sequelize.define('motions', {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        latitude: {type: Sequelize.DOUBLE},
        longitude: {type: Sequelize.DOUBLE},
        time: {type: Sequelize.DATE},
        vehicleId: {type: Sequelize.INTEGER}
    },
                            {
                                getterMethods:
                                    {
                                        latLng: function()
                                        {
                                            return {latitude: this.latitude,longitude: this.longitude};
                                        }
                                    }
                            });
};