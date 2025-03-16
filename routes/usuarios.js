const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/auth');
require('dotenv').config();

const { Usuario, Observacao } = require('../models');

// Rota de login (pública)
router.post('/login', async (req, res) => {
    const { login, senha } = req.body;

    if (!login || !senha) {
        return res
            .status(400)
            .json({ message: 'Login e senha são obrigatórios.' });
    }

    try {
        const usuarios = JSON.parse(process.env.USUARIOS_AUTENTICACAO || '{}');
        if (usuarios[login] && usuarios[login].senha === senha) {
            const token = jwt.sign(
                { login, role: usuarios[login].role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// Rotas protegidas
router.get('/', verificarToken, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.create({
            nome: req.body.nome,
            cpf: req.body.cpf,
        });
        res.status(201).json(usuario);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/cpf/:cpf', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            where: { cpf: req.params.cpf },
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/cpf/:cpf/observacoes', verificarToken, async (req, res) => {
    const { texto, data, complemento, criadoPor } = req.body;

    if (!texto || !data || !criadoPor) {
        return res
            .status(400)
            .json({ message: 'Texto, data e criadoPor são obrigatórios.' });
    }

    try {
        const usuario = await Usuario.findOne({
            where: { cpf: req.params.cpf },
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const observacao = await Observacao.create({
            texto,
            data,
            complemento,
            usuarioId: usuario.id,
            criadoPor,
        });

        res.status(201).json(observacao);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/cpf/:cpf/observacoes', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            where: { cpf: req.params.cpf },
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const observacoes = await Observacao.findAll({
            where: { usuarioId: usuario.id },
        });
        res.json(observacoes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/cpf/:cpf', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            where: { cpf: req.params.cpf },
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await Observacao.destroy({ where: { usuarioId: usuario.id } });
        await usuario.destroy();

        res.json({ message: 'Usuário e observações deletados com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/cpf/:cpf/observacoes/:id', verificarToken, async (req, res) => {
    try {
        const observacao = await Observacao.findByPk(req.params.id);
        if (!observacao) {
            return res
                .status(404)
                .json({ message: 'Observação não encontrada' });
        }

        await observacao.destroy();
        res.json({ message: 'Observação deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/cpf/:cpf', verificarToken, async (req, res) => {
    try {
        const { nome, cpf: novoCpf } = req.body;

        const usuario = await Usuario.findOne({
            where: { cpf: req.params.cpf },
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (novoCpf && novoCpf !== req.params.cpf) {
            const usuarioExistente = await Usuario.findOne({
                where: { cpf: novoCpf },
            });
            if (usuarioExistente) {
                return res.status(400).json({ message: 'CPF já está em uso' });
            }
        }

        await usuario.update({ nome, cpf: novoCpf || usuario.cpf });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:cpf/relatorio', verificarToken, async (req, res) => {
    const { relatorio } = req.body;

    try {
        const usuario = await Usuario.findOne({
            where: { cpf: req.params.cpf },
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Aluno não encontrado.' });
        }

        await usuario.update({ relatorio });
        res.status(200).json(usuario);
    } catch (err) {
        console.error('Erro ao salvar o relatório:', err);
        res.status(500).json({ message: 'Erro ao salvar o relatório.' });
    }
});

module.exports = router;
