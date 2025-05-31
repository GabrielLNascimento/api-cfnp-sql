const { Sequelize, DataTypes } = require('sequelize');
const shortid = require('shortid');

// Conexão com SQL Server usando Sequelize
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

// Modelo Usuario
const Usuario = sequelize.define(
    'Usuario',
    {
        id: {
            type: DataTypes.STRING,
            defaultValue: () => shortid.generate(), // usar função, não referência direta
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        relatorio: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
    },
    {
        tableName: 'usuarios',
        timestamps: false,
    }
);

// Modelo Observacao
const Observacao = sequelize.define(
    'Observacao',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        texto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        data: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        complemento: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        usuarioId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id',
            },
        },
        criadoPor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'observacoes',
        timestamps: false,
    }
);

// Relacionamentos
Usuario.hasMany(Observacao, { foreignKey: 'usuarioId', as: 'observacoes' });
Observacao.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = { sequelize, Usuario, Observacao };
