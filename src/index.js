const express = require("express");
const router = require("./routes");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Rodando na porta ${PORT}...`);
});

app.use("/", router);
