const { DataTypes, Model } = require('sequelize');
const sequelize = require('.././config/database');

class ImovelImagem extends Model {};

ImovelImagem.init({
    imovel_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imagem64: {
        type: DataTypes.STRING,
        allowNull: false
    },
    excluido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'imoveis_imagens',
    underscored: true
});

module.exports = ImovelImagem;