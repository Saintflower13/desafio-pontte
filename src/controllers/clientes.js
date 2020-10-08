const ModelCliente = require('.././models/clientes');
const CamposValidador = require('.././validators/clientes'); 
const DBRetornoValidador = require('.././validators/geral'); 

function MontarClienteEditar(cliente) {
    var cliente_editar = new Object();

    if (cliente.email !== undefined)
        cliente_editar.email = cliente.email;

    if (cliente.renda_mensal !== undefined)
        cliente_editar.renda_mensal = cliente.renda_mensal;
        
    if (cliente.estado_civil !== undefined)
        cliente_editar.estado_civil = cliente.estado_civil;

    if (cliente.comprovante_documento !== undefined) 
        cliente_editar.comprovante_documento = cliente.comprovante_documento;

    if (cliente.comprovante_renda !== undefined) 
        cliente_editar.comprovante_renda = cliente.comprovante_renda;

    return cliente_editar;
}

class ControllerClientes {
    ClienteCadastrado = async function(obj_where) {
        // Retorna o id do cliente se ele existir no banco de dados e
        // retorna -1 se não existir

        try {
            const resultado = await ModelCliente.findAll({
                where: obj_where,
                attributes: ['id']
            }); 
            
            if (!DBRetornoValidador.ValidarSelectRetorno(resultado))
                throw 'Erro';

            return resultado[0].id;
        } catch (error) {
            return -1;
        }
    }

    Cadastrar = async function(cliente) {
        try {
            let CamposValidar = new CamposValidador(cliente);
            let CamposInvalidos = CamposValidar.Cadastro();

            if (CamposInvalidos.length > 0)
                throw CamposInvalidos;

            // Verifica se já existe cliente cadastrado com o msm cpf
            const cliente_id = await ClienteCadastrado({ cpf: cliente.cpf });
            if (cliente_id > -1)
                return { status: true, id: cliente_id };

            // Cadastra o cliente
            const resultado = await ModelCliente.create(cliente);
            if (!DBRetornoValidador.ValidarCreateRetorno(resultado))
                throw 'Nao foi possivel cadastrar cliente.';

            return { status: true, id: resultado.id };
        } catch (error) {
            return { status: false, error: error };
        }
    } 

    Editar = async function(cliente) {
        try {
            var cliente_editar = MontarClienteEditar(cliente);
            console.log('campos editar ' + JSON.stringify(cliente_editar,null,2));

            let CamposValidar = new CamposValidador(cliente_editar);
            let CamposInvalidos = CamposValidar.Cadastro();

            if (CamposInvalidos.length > 0)
                throw CamposInvalidos;

            const resultado = await ModelCliente.update(cliente_editar, {
                where: {
                    id: cliente.id
                }
            });

            if (!DBRetornoValidador.ValidarUpdateRetorno(resultado))
                throw 'Nao foi possivel cadastrar imovel.';

            return { status: true };
        } catch (error) {
            return { status: false, error: error };    
        }
    }
}

module.exports = new ControllerClientes();