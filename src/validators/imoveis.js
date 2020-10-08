class CamposValidador {
    imovel;

    constructor(imovel) {
        this.imovel = imovel;
    }

    Cadastro() {
        var CamposNaoInformados = new Array();
        
        if (this.imovel.uf === undefined)
            CamposNaoInformados.push('UF nao informado.');

        if (this.imovel.cep === undefined)
            CamposNaoInformados.push('CEP nao informado.');

        if (this.imovel.cidade === undefined)
            CamposNaoInformados.push('Cidade nao informada.');
        
        if (this.imovel.bairro === undefined)
            CamposNaoInformados.push('Bairro nao informado.');
        
        if (this.imovel.logadouro === undefined)
            CamposNaoInformados.push('Logadouro nao informado.');
        
        if (this.imovel.numero === undefined)
            CamposNaoInformados.push('Numero nao informado.');

        return CamposNaoInformados;
    }
}

module.exports = CamposValidador;