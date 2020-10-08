const ModelImoveis = require('.././models/imoveis');
const CamposValidador = require('.././validators/imoveis'); 
const DBRetornoValidador = require('.././validators/geral'); 

function MontarImovelEditar(imovel) {
    var imovel_editar = new Object();

    if (imovel.uf !== undefined)
        imovel_editar.uf = imovel.uf;

    if (imovel.cep !== undefined)
        imovel_editar.cep = imovel.cep;

    if (imovel.cidade !== undefined)
        imovel_editar.cidade = imovel.cidade;

    if (imovel.bairro !== undefined)
        imovel_editar.bairro = imovel.bairro;

    if (imovel.logadouro !== undefined)
        imovel_editar.logadouro = imovel.logadouro;

    if (imovel.numero !== undefined)
        imovel_editar.numero = imovel.numero;

    return imovel_editar;
}

class ControllerImoveis {
    Cadastrar = async function(imovel) {
        try {
            let CamposValidar = new CamposValidador(imovel);
            let CamposInvalidos = CamposValidar.Cadastro();

            if (CamposInvalidos.length > 0)
                throw CamposInvalidos;

            const resultado = await ModelImoveis.create(imovel);
            if (!DBRetornoValidador.ValidarCreateRetorno(resultado))
                throw 'Nao foi possivel cadastrar imovel.';
                
            return { status: true, resultado: resultado.dataValues };
        } catch (error) {
            return { status: false, error: error };    
        }
    } 

    Editar = async function(imovel) {
        try {
            const resultado = await ModelImoveis.update(MontarImovelEditar(imovel), { 
                where: { 
                    id: imovel.id 
                } 
            });

            if (!DBRetornoValidador.ValidarUpdateRetorno(resultado))
                throw 'Nao foi possivel editar imovel.';

            return { status: true, resultado: resultado[0] };
        } catch (error) {
            return { status: false, error: error };   
        } 
    }
}

module.exports = new ControllerImoveis();