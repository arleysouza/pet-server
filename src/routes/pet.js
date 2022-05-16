const router = require("express").Router();
const {PetController} = require("../controllers");
const {create, list, remove,  update} = new PetController();

router.post("/create", create);
router.delete("/remove", remove);
router.put("/update", update);
router.get("/list", list);

router.use( (_, res) => {
	res.status(200).json({error:"Operação desconhecida com o pet"});
});

module.exports = router;

