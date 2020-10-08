const express = require('express');
const router = express.Router();

const ControllerEmprestimo = require('.././controllers/emprestimos');

router.post('/cadastrar/01/', ControllerEmprestimo.Cadastrar.Etapa01);
router.post('/cadastrar/02/:emprestimo_id', ControllerEmprestimo.Cadastrar.Etapa02);
router.patch('/cadastrar/03/:emprestimo_id', ControllerEmprestimo.Cadastrar.Etapa03);
router.put('/editar/01/:emprestimo_id', ControllerEmprestimo.Editar.Etapa01);
router.put('/editar/02/:emprestimo_id', ControllerEmprestimo.Editar.Etapa02);
router.get('/listar/', ControllerEmprestimo.Listar);

module.exports = router;
