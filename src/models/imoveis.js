const { DataTypes, Model } = require('sequelize');
const sequelize = require('.././config/database');

class Imovel extends Model {};

Imovel.init({
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uf: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: -1
    },
    cep: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    logadouro: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'imoveis',
    underscored: true
});

module.exports = Imovel;