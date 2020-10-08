const { DataTypes, Model } = require('sequelize');
const sequelize = require('.././config/database');

class Cliente extends Model {};

Cliente.init({
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    nome_completo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    renda_mensal: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    estado_civil: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comprovante_documento: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    comprovante_renda: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    }
}, {
    sequelize,
    tableName: 'clientes',
    underscored: true
});

module.exports = Cliente;