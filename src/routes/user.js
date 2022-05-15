const router = require("express").Router();
const {UserController} = require("../controllers");
const {authentication} = require("../middlewares");
const {login, create, updatepassword} = new UserController();

router.post("/login", login);
router.post("/create", create);
router.put("/update/password", authentication, updatepassword);

router.use( (_, res) => {
	res.status(400).json({error:"Operação desconhecida com o usuário"});
});

module.exports = router;

