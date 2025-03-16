const { Sequelize, DataTypes } = require('sequelize');
const shortid = require('shortid');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
    }
);

// Modelo Usuario
const Usuario = sequelize.define(
    'Usuario',
    {
        id: {
            type: DataTypes.STRING,
            defaultValue: shortid.generate,
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
