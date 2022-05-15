const { DataTypes } = require("sequelize");
const database = require("../database");

const Medicine = database.define(
	"medicine",
	{
		idmedicine: {
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
					msg: "Forneça o nome do medicamento"
				}
			},
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	},
	{
		freezeTableName: true,
	}
);

module.exports = Medicine;
