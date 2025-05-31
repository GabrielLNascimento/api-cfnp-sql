module.exports = {
    development: {
        username: 'sa', // ou outro usuário
        password: 'ga02042007',
        database: 'NOME_DO_BANCO',
        host: 'localhost',
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: false, // true se estiver usando Azure
                trustServerCertificate: true, // necessário para conexões locais
            },
        },
    },
};
