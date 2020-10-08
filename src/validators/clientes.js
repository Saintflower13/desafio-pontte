const validar_cpf = require('validar-cpf');
const isBase64 = require('is-base64');

class CamposValidador {
    cliente;

    constructor(cliente) {
        this.cliente = cliente;
    }

    Cadastro() {
        var CamposValidados = new Array();

        if (this.cliente.nome_completo === undefined)
            CamposValidados.push('Nome do cliente nao informado.');

        if (this.cliente.email === undefined)
            CamposValidados.push('Email do cliente nao informado.');

        if (this.cliente.cpf === undefined) 
            CamposValidados.push('CPF do cliente nao informado.');
        else {
            if (!validar_cpf(this.cliente.cpf))
                CamposValidados.push('CPF do cliente invalido.');
        }
  
        return CamposValidados;
    }

    Edicao() {
        var CamposValidados = new Array();

        if (this.cliente.email !== undefined) {
            if (this.cliente.email == '')
                CamposValidados.push('Email do cliente invalido.');
        }

        if (this.cliente.comprovante_documento !== undefined) {
            if (isBase64(this.cliente.comprovante_documento)) 
                CamposValidados.push('Comprovante do cliente invalido.');
        }

        return CamposValidados;
    }
}

module.exports = CamposValidador;