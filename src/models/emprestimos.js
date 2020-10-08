const { DataTypes, Model } = require('sequelize');
const sequelize = require('.././config/database');

class Emprestimo extends Model {};

Emprestimo.init({
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    imovel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    valor: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    etapa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    aprovado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'emprestimos',
    underscored: true
});

module.exports = Emprestimo;