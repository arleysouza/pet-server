const { DataTypes } = require("sequelize");
const database = require("../database");

const Pet = database.define(
	"pet",
	{
		idpet: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça o nome do pet"
				}
			},
		}
	},
	{
		freezeTableName: true,
	}
);

module.exports = Pet;
