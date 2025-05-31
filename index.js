const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
require('dotenv').config();
// const verificarToken = require('./middleware/auth'); // Se não for usar ainda, comente

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao SQL Server usando Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mssql',
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        },
        logging: false,
    }
);

// Testar a conexão
sequelize
    .authenticate({force: false})
    .then(() => console.log('✅ Conectado ao SQL Server'))
    .catch((err) => console.error('❌ Erro ao conectar ao SQL Server:', err));

// Importar modelos
const { Usuario, Observacao } = require('./models');

// Sincronizar modelos com o banco de dados
sequelize.sync().then(() => {
    console.log('📦 Tabelas sincronizadas com o SQL Server');
});

// Importar o arquivo de rotas
const usuarioRoutes = require('./routes/usuarios');

// Usar as rotas
// app.use('/usuarios', verificarToken, usuarioRoutes); // Se quiser proteger
app.use('/usuarios', usuarioRoutes); // Pública por enquanto

// Rota inicial
app.get('/', (req, res) => {
    res.send('API de Usuários e Observações');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
