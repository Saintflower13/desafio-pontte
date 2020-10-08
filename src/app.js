const express = require('express');
const RoutesEmprestimos = require('./routes/emprestimos');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/emprestimos/', RoutesEmprestimos);

module.exports = app;