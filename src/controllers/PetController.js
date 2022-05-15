const { Pet } = require("../models");
const {getToken} = require("../middlewares");

class PetController {
	async create(req, res) {
		const {iduser} = await getToken(req);
		let { name } = req.body;
		name = (name || "").toString().trim();

		//verifica se o usuário já possui um pet com o mesmo nome
		return await Pet.findOne({ where: { iduser, name } })
			.then(async (pet) => {
				if (pet) {
					return res.status(400).json({ error: `Você já possui um pet de nome ${name}` });
				}
				return await Pet.create({iduser,name})
				.then(async (pet) => {
					const { idpet, name } = pet.get();
					return res.json({ idpet, name });
				})
				.catch((err) => {
					// pega os erros de validação emitidos pelo modelo do Sequelize
					if( err.errors && err.errors.length > 0 ){
						return res.status(200).json({ error: err.errors[0].message });
					}
					else{
						return res.status(200).json({ error: err.message });
					}
				});
			})
			.catch((err) => {
				if( err.errors && err.errors.length > 0 ){
					return res.status(200).json({ error: err.errors[0].message });
				}
				else{
					return res.status(200).json({ error: err.message });
				}
			  });
	}

	async update(req, res) {
		// obtém o iduser que está no token
		const {iduser} =  await getToken(req);
		let { idpet, name } = req.body;
		name = (name || "").toString().trim();
		idpet = (idpet || "").toString();
		if( idpet === "" ){
			return res.status(200).json({ error: "Forneça a identificação do pet" });
		}

		return await Pet.findOne({ where: { idpet, iduser } })
			.then(async (pet) => {
				if (pet) {
					await pet.update({ name });
					return res.json({idpet, name:pet.name});
				}
				return res.status(200).json({ error: "Pet não identificado" });
			})
			.catch((err) => {
				if( err.errors && err.errors.length > 0 ){
					return res.status(200).json({ error: err.errors[0].message });
				}
				else{
					return res.status(200).json({ error: err.message });
				}
			  });
	}

	async remove(req, res) {
		const { iduser } = await getToken(req);
		let { idpet } = req.body;
		idpet = (idpet || "").toString();
		if( idpet === "" ){
			return res.status(400).json({ error: "Forneça a identificação do pet" });
		}

		return await Pet.findOne({ where: { idpet, iduser } })
			.then(async (pet) => {
				if (pet !== null) {
					await pet.destroy();
					return res.json({ idpet, name:pet.name });
				} else {
					return res.status(200).json({ error: "Pet não identificado" });
				}
			})
			.catch((err) => {
				if( err.errors && err.errors.length > 0 ){
					return res.status(200).json({ error: err.errors[0].message });
				}
				else{
					return res.status(200).json({ error: err.message });
				}
			  });
	}

	async list(req, res) {
		const {iduser} = await getToken(req);
		let { limit, offset } = req.body;
		return await Pet.findAndCountAll({
			where: { iduser },
			attributes: ["idpet", "name"],
			order: [["name", "ASC"]],
			offset,
			limit,
		})
			.then((pets) => {
				return res.json({
					pets: pets.rows.map((item) => item.get()),
					count: pets.count,
				});
			})
			.catch((e) => {
				return res.status(200).json({ error: e.message });
			});
	}
}

module.exports = PetController;
