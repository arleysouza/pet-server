const router = require("express").Router();
const {MedicineController} = require("../controllers");
const {create, remove, update, list} = new MedicineController();

router.post("/create", create);
router.delete("/remove", remove);
router.put("/update", update);
router.post("/list", list);

router.use( (_, res) => {
	res.status(200).json({error:"Operação desconhecida com o medicamento"});
});

module.exports = router;
