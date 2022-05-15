const { User } = require("../models");
const bcrypt = require("bcrypt");
const { generateToken, getToken } = require("../middlewares");

class UserController {
	async login(req, res) {
		let { mail, password } = req.body;
		mail = (mail || "").toString().trim();
		password = (password || "").toString().trim();
		if (password.length < 6 || password.length > 10) {
			return res.status(200).json({ error: "A senha deve ter entre 6 e 10 caracteres" });
		}

		return await User.findOne({
			where: { mail },
		})
			.then(async (user) => {
				if (user) {
					if (user.comparePassword(password, user.password)) {
						// inclui no token o id e e-mail do usuário
						const token = await generateToken({
							iduser: user.iduser,
							mail: user.mail
						});

						// envia para o cliente o token, idusuario e mail
						return res.json({
							token,
							mail: user.mail
						});
					} else
						return res
							.status(200)
							.json({ error: "Dados de login não conferem" });
				} else
					return res.status(200).json({ error: "Usuário não identificado" });
			})
			.catch((e) => {
				return res.status(200).json({ error: e.message });
			});
	}

	async create(req, res) {
		let { mail, password } = req.body;
		mail = (mail || "").toString().trim();
		password = (password || "").toString().trim();
		if (password.length < 6 || password.length > 10) {
			return res.status(200).json({ error: "A senha deve ter entre 6 e 10 caracteres" });
		}
		password = bcrypt.hashSync(password,bcrypt.genSaltSync(10));

		return await User.create({ mail, password })
			.then(async (r) => {
				const { iduser, mail } = r.get();

				//cria o token de login do usuário
				const token = await generateToken({iduser, mail});

				return res.status(200).json({ mail, token });
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
	}

	async updatepassword(req, res) {
		// obtém o iduser que está no token
		const {iduser} =  await getToken(req);
		let { password } = req.body;
		password = (password || "").toString().trim();
		if (password.length < 6 || password.length > 10) {
			return res.status(200).json({ error: "A nova senha deve ter entre 6 e 10 caracteres" });
		}
		password = bcrypt.hashSync(password,bcrypt.genSaltSync(10));

		return await User.findOne({ where: { iduser } })
			.then(async (user) => {
				if (user) {
					await user.update({ password });
					return res.json({ mail:user.mail});
				}
				return res.status(200).json({ error: "Usuário não identificado" });
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
}

module.exports = UserController;
