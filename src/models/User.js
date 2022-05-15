const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const database = require("../database");

const User = database.define(
	"user",
	{
		iduser: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		mail: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				msg: "O e-mail já existe no cadastro",
			},
			validate: {
				notEmpty:{
					msg: "Forneça um e-mail"
				},
				isEmail: {
					msg: "Forneça um e-mail válido",
				},
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a senha"
				}
			},
		},
	},
	{
		freezeTableName: true
	}
);

// adiciona o método camparePasswor no modelo usuário
User.prototype.comparePassword = (password, hash) => {
	return bcrypt.compareSync(password, hash);
};

module.exports = User;
