const { DataTypes } = require("sequelize");
const database = require("../database");

const Payment = database.define(
	"payment",
	{
		idpayment: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a descrição do gasto"
				}
			},
		},
		value: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça o valor do gasto"
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

module.exports = Payment;
