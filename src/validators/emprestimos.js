const global = require('.././global/constantes');
const ValidadorCliente = require('./clientes');

class CamposValidador {
    emprestimo;

    constructor(emprestimo) {
        this.emprestimo = emprestimo;
    }

    ValorEmprestimo(valor) {
        return parseFloat(valor) >= global.EMPRESTIMO_VALOR_MINIMO || 
            parseFloat(valor) <= global.EMPRESTIMO_VALOR_MAXIMO;
    }

    CadastroEtapa01(body) {
        let CamposInvalidos = new Array();

        if (body.cliente == undefined) {
            CamposInvalidos.push('Cliente nao informado.');
        } else {
            let ValidarCliente = new ValidadorCliente(body.cliente);
            let CamposInvalidosCliente = ValidarCliente.Cadastro();

            if (CamposInvalidosCliente.length > 0)
                CamposInvalidos = CamposInvalidosCliente;
        }

        if (body.valor_emprestimo == undefined) {
            CamposInvalidos.push('Valor do emprestimo nao informado.');
        } else {
            if (parseFloat(body.valor_emprestimo) < global.EMPRESTIMO_VALOR_MINIMO || 
                parseFloat(body.valor_emprestimo) > global.EMPRESTIMO_VALOR_MAXIMO)
            //if (!ValorEmprestimo(body.valor_emprestimo)) 
                {
                    CamposInvalidos.push('Valor do emprestimo deve estar entre R$' + global.EMPRESTIMO_VALOR_MINIMO + 
                    ' e R$' + global.EMPRESTIMO_VALOR_MAXIMO + '.');
                }
        }

        return CamposInvalidos;
    }

    Edicao() {
 
    }
}

module.exports = CamposValidador;