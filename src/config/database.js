const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:KQ9OS4NBW12@development.cbxkchdyy9c5.us-west-1.rds.amazonaws.com:5432/desafio-pontte');

module.exports = sequelize;