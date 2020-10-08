const app = require('./src/app');
const port = 8081;

app.listen(port, () => {
    console.log('Aplicacao rodando na porta ' + port + '.');
}); 