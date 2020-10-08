const ModelImoveisImagens = require('.././models/imoveis_imagens');
const DBRetornoValidador = require('.././validators/geral'); 
const isBase64 = require('is-base64');

function MontarImagensInserir(imovel_id, imagens) {
    var imagens_inserir = new Array();
    var imagens_nao_inserir = new Array();

    for (var i = 0; i < imagens.length; i++) {
        if (true) //if (isBase64(imagens[i]))
            imagens_inserir.push({ imagem64: imagens[i],  imovel_id: imovel_id });
        else
            imagens_nao_inserir.push(imagens[i]);    
    }

    return { inserir: imagens_inserir, nao_inserir: imagens_nao_inserir };
}

class ControllerImoveisImagens {
    async Inserir(imovel_id, imagens) {
        try {
            var imagens_insercao = MontarImagensInserir(imovel_id, imagens);
            if (imagens_insercao.inserir.length < 1)
                throw 'Nao foi possivel inserir as imagens: ' + 
                    JSON.stringify(imagens_insercao.nao_inserir, null, 2);    

            const resultado = await ModelImoveisImagens.bulkCreate(imagens_insercao.inserir);
            if (!DBRetornoValidador.ValidarBulkCreateRetorno(resultado))
                throw 'Ocorreu(ram) erro(s) ao tentar inserir imagens.';

            return { status: false, resultado: resultado };   
        } catch (error) {
            return { status: false, error: error };   
        }
    } 

    async Excluir(ids_excluir) {
        try {
            if (ids_excluir.length < 1)     
                return { status: true, resultado: 'Nao foram informados ids para exclusao.' };

            const resultado = await ModelImoveisImagens.update({ 
                excluido: true 
            }, { 
                where: { 
                    id: ids_excluir 
                } 
            });

            if (!DBRetornoValidador.ValidarUpdateRetorno(resultado))
                throw 'Ocorreu(ram) erro(s) ao tentar excluir imagens.';

            return { status: true };
        } catch (error) {
            return { status: false, error: error };   
        }
    }
}

module.exports = new ControllerImoveisImagens();