const User = require("./User");
const Pet = require("./Pet");
const Medicine = require("./Medicine");
const Payment = require("./Payment");

const database = require("../database");

User.hasMany(Pet, {
	foreignKey: {
		name: "iduser",
		allowNull: false
	},
	sourceKey: "iduser",
	onDelete: "cascade",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
});
Pet.belongsTo(User, {foreignKey: "iduser", targetKey: "iduser"});

Pet.hasMany(Medicine, {
	foreignKey: {
		name: "idpet",
		allowNull: false
	},
	sourceKey: "idpet",
	onDelete: "cascade",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
});
Medicine.belongsTo(Pet, {foreignKey: "idpet", targetKey: "idpet"});

Pet.hasMany(Payment, {
	foreignKey: {
		name: "idpet",
		allowNull: false
	},
	sourceKey: "idpet",
	onDelete: "cascade",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
});
Payment.belongsTo(Pet, {foreignKey: "idpet", targetKey: "idpet"});

//database.sync({force:true});
database.sync();

module.exports = {
  User,
  Pet,
  Medicine,
  Payment
};
