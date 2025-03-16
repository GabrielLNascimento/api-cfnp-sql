const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
require('dotenv').config();
const verificarToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MySQL usando Sequelize
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        logging: false, // Desativa logs de SQL, opcional
    }
);

// Testar a conexão
sequelize
    .authenticate()
    .then(() => console.log('Conectado ao MySQL'))
    .catch((err) => console.error('Erro ao conectar ao MySQL:', err));

// Importar modelos
const { Usuario, Observacao } = require('./models');

// Sincronizar modelos com o banco de dados
sequelize.sync({ force: true }).then(() => {
    console.log('Tabelas sincronizadas com o MySQL');
});

// Importar o arquivo de rotas
const usuarioRoutes = require('./routes/usuarios');

// Usar as rotas
app.use('/usuarios', usuarioRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.send('API de Usuários e Observações');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
