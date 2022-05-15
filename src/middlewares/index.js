const jwt = require("jsonwebtoken");
require("dotenv").config();

// cria um token usando os dados do usuário
const generateToken = async user => jwt.sign(user, process.env.JWT_SECRET);

// verifica se o token é válido
const validateToken = async token => {
	return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) throw new Error("Problema para checar os dados de acesso");
		else return decoded;
	});
};

// verifica se o usuário possui autenticação
const authentication = async (req, res, next) => {
	// o token precisa ser enviado pelo cliente no header da requisição
	const { authorization } = req.headers;

	// verifica se existe a propriedade authorization no header da requisição
	if (!authorization)
		return res.status(200).json({ error: "É necessário efetuar o login" });

	const [, token] = authorization.split(" ");

	try {
		// será lançada uma exceçao se o token não for válido
		await validateToken(token);
		return next();
	} catch (error) {
		return res.status(200).json({ error: error.message });
	}
};

const getToken = async (req) => {
	const { authorization } = req.headers;
	try {
		const [, token] = authorization.split(" ");
		return jwt.decode(token);
	} catch (error) {
		return null;
	}
};

module.exports = { authentication, getToken, generateToken };
