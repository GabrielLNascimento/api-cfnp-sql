require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER, // ou outro usuário
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
            options: {
                encrypt: false, // true se estiver usando Azure
                trustServerCertificate: true, // necessário para conexões locais
            },
        },
    },
};
