const router = require("express").Router();
const { authentication } = require("../middlewares");
const userRoute = require("./user");
const petRoute = require("./pet");
const medicineRoute = require("./medicine");
const paymentRoute = require("./payment");

router.use("/user", userRoute);
router.use("/pet", authentication, petRoute);
router.use("/medicine", authentication, medicineRoute);
router.use("/payment", authentication, paymentRoute);

router.use( (_, res) => {
	res.status(400).json({error:"Operação desconhecida"});
});

module.exports = router;
