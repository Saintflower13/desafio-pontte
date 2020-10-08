const ModelEmprestimos = require('.././models/emprestimos');
const ControllerClientes = require('./clientes');
const ControllerImoveis = require('./imoveis');
const ControllerImoveisImagens = require('./imoveis_imagens');
const CamposValidador = require('.././validators/emprestimos'); 
const DBRetornoValidador = require('.././validators/geral'); 

function MontaEmprestimoCadastrar(valor, cliente_id, imovel_id) {
    if (imovel_id < 1)
        imovel_id = undefined;

    return {
        valor: valor,
        cliente_id: cliente_id,
        etapa: 1,
        aprovado: false,
        imovel_id: imovel_id
    }
}

async function EmprestimoEtapa(emprestimo_id) {
    const resultado = await ModelEmprestimos.findAll({
        where: { id: emprestimo_id },
        attributes: ['etapa']
    });

    if (!DBRetornoValidador.ValidarSelectRetorno(resultado))
        return -1;

    return resultado[0].etapa;
}

async function EmprestimoCampos(emprestimo_id, campos) {
    const resultado = await ModelEmprestimos.findAll({
        where: { id: emprestimo_id },
        attributes: campos
    });

    if (!DBRetornoValidador.ValidarSelectRetorno(resultado))
        return -1;

    return resultado[0];
}

function MontarComprovantes(body) {
    return {
        comprovante_documento: body.cliente_documento,
        comprovante_renda: body.cliente_comprovante_renda
    }
}

async function GetIdClienteEmprestimo(emprestimo_id) {
    var resultado = await ModelEmprestimos.findAll({
        where: {
            id: emprestimo_id
        },
        attributes: ['cliente_id']
    });

    if (!DBRetornoValidador.ValidarSelectRetorno(resultado))
        return -1;

    return resultado[0].id;
}

async function GetIdImovelEmprestimo(emprestimo_id) {
    var resultado = await ModelEmprestimos.findAll({
        where: {
            id: emprestimo_id
        },
        attributes: ['imovel_id']
    });

    if (!DBRetornoValidador.ValidarSelectRetorno(resultado))
        return -1;

    return resultado[0].imovel_id > 0 ? resultado[0].imovel_id : -1;
}

async function AlterarEmprestimo(emprestimo_id, emprestimo) {
    const resultado = await ModelEmprestimos.update(emprestimo, { 
        where: { 
            id: emprestimo_id
        } 
    });

    return DBRetornoValidador.ValidarUpdateRetorno(resultado);
}

class ControllerEmprestimos {
    Cadastrar = {
        Etapa01: async function(req, res) {
            try {
                // Valida os campos obrigatórios da requisição
                let CamposValidar = new CamposValidador();
                let CamposInvalidos = CamposValidar.CadastroEtapa01(req.body);
                
                if (CamposInvalidos.length > 0)
                    return res.status(400).send('Campos incorretos: ' + JSON.stringify(CamposInvalidos, null, 2));

                var emprestimo_cliente_id = 0;

                // Valida se o cliente informado é válido                
                if (req.body.cliente.id !== undefined) {
                    emprestimo_cliente_id = await ControllerClientes.ClienteCadastrado({ id: req.body.cliente.id });
                    if (emprestimo_cliente_id == -1)
                        return res.status(400).send('Cliente nao encontrado.');
                } 
                else // Se o cliente especifico não foi informado, valida de o cpf já existe no banco 
                    // e retorna o id do cliente
                    emprestimo_cliente_id = await ControllerClientes.ClienteCadastrado({ cpf: req.body.cliente.cpf });       
                    
                // Cadastra cliente, se necessário
                if (emprestimo_cliente_id == -1) {
                    var cliente_cadastrado = await ControllerClientes.Cadastrar(req.body.cliente);
                    if (!cliente_cadastrado.status)
                        return res.status(400).send('Nao foi possivel cadastrar o cliente.');

                    emprestimo_cliente_id = cliente_cadastrado.id;
                }   

                var ErrosNaoFatais = new Array();
                var emprestimo_imovel_id = -1;

                // Cadastra imóvel, se a chave imovel foi informada
                if (req.body.imovel !== undefined) {
                    var emprestimo_imovel = req.body.imovel;
                    emprestimo_imovel.cliente_id = emprestimo_cliente_id;
    
                    var imovel_cadastrado = await ControllerImoveis.Cadastrar(emprestimo_imovel);
                    if (!imovel_cadastrado.status)
                        ErrosNaoFatais.push('Erro ao cadastrar imovel: ' + imovel_cadastrado.error);
                    else
                        emprestimo_imovel_id = imovel_cadastrado.resultado.id;
                }

                // Insere o emprestimo no banco de dados
                var emprestimo = MontaEmprestimoCadastrar(req.body.valor_emprestimo, 
                    emprestimo_cliente_id, emprestimo_imovel_id);

                const resultado = await ModelEmprestimos.create(emprestimo);
                if (!DBRetornoValidador.ValidarCreateRetorno(resultado))
                    throw 'Nao foi possivel cadastrar o emprestimo.';

                res.status(201).send({ 
                                       emprestimo_id: resultado.id, 
                                       cliente_id: emprestimo_cliente_id, 
                                       imovel_id: emprestimo_imovel_id
                                    });
            } catch (error) {
                res.status(500).send(error);
            }
        },



        Etapa02: async function(req, res) {
            try {
                // Valida os campos obrigatórios da requisição
                const emprestimo_etapa = EmprestimoEtapa(req.params.emprestimo_id);
                if (emprestimo_etapa !== 1)
                    return res.status(400).send('Emprestimo deve estar na etapa 1.');

                if (req.body.cliente_documento === undefined)
                    return res.status(400).send('Imagenm do CPF ou CNH eh obrigatorio.');
                
                // Pega o cliente vinculado no emprestimo
                var emprestimo_cliente_id = GetIdClienteEmprestimo(req.params.emprestimo_id);
                if (emprestimo_cliente_id = -1)
                    throw 'Nao foi possivel identificar cliente vinculado a este emprestimo.';

                // Monta objeto com os comprovantes informados
                var cliente_comprovantes = MontarComprovantes(req.body);
                cliente_comprovantes.id = cliente_resultado[0].cliente_id;

                const comprovantes_resultado = await ControllerClientes.Editar(cliente_comprovantes);
                if (!comprovantes_resultado.status)
                    throw comprovantes_resultado.error;
                  
                var ErrosNaoFatais = new Array();

                // Insere as imagens do imovel, se elas forem informadas 
                if (req.body.imovel_imagens !== undefined) {
                    if (req.body.imovel_imagens.length > 0) {
                        var imovel_id = GetIdImovelEmprestimo(req.params.emprestimo_id);

                        if (imovel_id = -1)  
                            ErrosNaoFatais.push('Emprestimo nao possui imovel vinculado.');
                        else {
                            // Insere as imagens do imóvel
                            const imovel_imagens_resultado = await ControllerImoveisImagens.Inserir(
                                imovel_id,
                                req.body.imovel_imagens
                            );

                            if (!imovel_imagens_resultado.status)
                                ErrosNaoFatais.push(imovel_imagens_resultado.error);            
                        }      
                    }
                }

                // Seta etapa do emprestimo para a Etapa 2
                await AlterarEmprestimo(req.params.emprestimo_id, { etapa: 2 });
                res.status(201).send('Imagens salvas com sucesso.');
            } catch (error) {
                res.status(500).send(error);
            }            
        },


        Etapa03: async function(req, res) {
            try {
                if (req.body.aprovado === undefined)
                    return res.status(400).send('Campo aprovado nao informado.');

                if (typeof req.body.aprovado !== 'boolean')
                    return res.status(400).send('Campo aprovado invalido.');
                
                const emprestimo_etapa = EmprestimoEtapa(req.params.emprestimo_id);
                    if (emprestimo_etapa !== 2)
                        return res.status(400).send('Emprestimo deve estar na etapa 2.');
        
                await AlterarEmprestimo(req.params.emprestimo_id, { etapa: 3, aprovado: req.body.aprovado});
                res.status(200).send('Emprestimo atualizado com sucesso.');
            } catch (error) {
                res.status(500).send(error);
            }
        }
    }


    Editar = {
        Etapa01: async function(req, res) { 
            try {
                var emprestimo_resultado = await EmprestimoCampos(req.params.emprestimo_id, ['etapa', 'cliente_id', 'imovel_id']);
                if (emprestimo_resultado == -1)
                    return res.status(400).send('Nao foi possivel encontrar o emprestimo informado.');
        
                if (emprestimo_resultado[0].etapa == 3)
                    return res.status(400).send('Contrato nao pode ser mais editado.');

                var erros = new Array();

                // Valida os campos de cliente
                if (req.body.cliente !== undefined) {
                    var cliente_atualizar = req.body.cliente;
                    cliente_atualizar.id = emprestimo[0].cliente_id;

                    const cliente_resultado = await ControllerClientes.Editar(cliente_atualizar);
                    if (!cliente_resultado.status)
                        erros.push(cliente_resultado.error);    
                } 

                // Valida os campos de imovel
                if (req.body.imovel !== undefined) {
                    if (emprestimo[0].imovel_id > 0) {
                        var imovel_atualizar = req.body.imovel;
                        imovel_atualizar.id =  emprestimo[0].imovel_id;
                
                        const imovel_resultado = await ControllerImoveis.Editar(imovel_atualizar);
                        if (!imovel_resultado.status)
                            erros.push(imovel_resultado.error);
                    }
                }

                // Valida o campo de valor do emprestimo
                if (req.body.valor_emprestimo !== undefined) {
                    if (!CamposValidador.ValorEmprestimo(req.body.valor_emprestimo))
                        erros.push('Valor do emprestimo eh invalido.');
                    else {
                        var valor_resultado = await ModelEmprestimos.update({ valor: req.body.valor_emprestimo }, { 
                            where: { 
                                id: req.params.emprestimo_id 
                            } 
                        });
                        
                        if (!DBRetornoValidador.ValidarUpdateRetorno(valor_resultado))
                            erros.push('Nao foi possivel atualizar o valor do emprestimo.');
                        
                    }
                }

                if (erros.length == 0)
                    res.status(200).send('Emprestimo atualizado com sucesso.');
                else 
                    res.status(400).send(erros);    
            } catch (error) {
                res.status(500).send(error);
            }
        },



        Etapa02: async function(req, res) {
            try {
                var emprestimo_resultado = await EmprestimoCampos(req.params.emprestimo_id, ['etapa', 'cliente_id', 'imovel_id']);
                    if (emprestimo_resultado == -1)
                        return res.status(400).send('Nao foi possivel encontrar o emprestimo informado.');

                if (emprestimo_resultado[0].etapa != 2)
                return res.status(400).send('Contrato nao esta na etapa apropriada.');

                // Monta objeto com os comprovantes informados
                var cliente_comprovantes = MontarComprovantes(req.body);
                cliente_comprovantes.id = cliente_resultado[0].cliente_id;

                var erros = new Array();
                
                if(req.body.cliente_documento !== undefined || req.body.cliente_comprovante_renda !== undefined) {
                    const cliente_resultado = await ControllerClientes.Editar(comprovantes_cliente);
                    if (!cliente_resultado.status)
                        erros.push(cliente_resultado.error); 
                }

                if (req.body.imovel_imagens !== undefined && emprestimo[0].imovel_id > 0) {
                    if (req.body.imovel_imagens.inserir !== undefined) {
                        const img_inserir_resultado = await ControllerImoveisImagens.Inserir(emprestimo[0].imovel_id,
                            req.body.imovel_imagens.inserir);

                        if (!img_inserir_resultado.status)
                            erros.push(img_inserir_resultado.error);
                    }

                    if (req.body.imovel_imagens.excluir !== undefined) {
                        const img_excluir_resultado = await ControllerImoveisImagens.Excluir(req.body.imovel_imagens.excluir);
                        if (!img_excluir_resultado.status)
                            erros.push(img_excluir_resultado.error);
                    }
                }            

                if (erros.length > 0)
                    res.status(400).send(erros);
                else
                    res.status(200).send('Emprestimo atualizado com sucesso.');
            } catch (error) {
                res.status(500).send(error);
            }
        }
    }

    Listar = async function (req, res) {
        try {
            const lista = await ModelEmprestimos.findAll();
            res.status(200).send(JSON.stringify(lista, null, 2));   
        } catch (error) {
            res.status(500).send(error);
        }
    } 
}

module.exports = new ControllerEmprestimos();