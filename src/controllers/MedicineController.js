const { Medicine } = require("../models");

class MedicineController {
  async create(req, res) {
    let { idpet, name } = req.body;
    idpet = (idpet || "").toString();
    name = (name || "").toString().trim();

    if( idpet === "" ){
        return res.status(200).json({ error: "Forneça a identificação do pet" });
    }

    return await Medicine.create({ idpet, name })
      .then(async (medicine) => {
        const { idmedicine, idpet, name, date } = medicine.get();
        return res.json({ idmedicine, idpet, name, date });
      })
      .catch((err) => {
        // pega os erros de validação emitidos pelo modelo do Sequelize
        if (err.errors && err.errors.length > 0) {
          return res.status(200).json({ error: err.errors[0].message });
        } else {
          return res.status(200).json({ error: err.message });
        }
      });
  }

  async update(req, res) {
    let { idmedicine, name } = req.body;
    idmedicine = (idmedicine || "").toString();
    name = (name || "").toString().trim();
    if (idmedicine === "") {
      return res
        .status(200)
        .json({ error: "Forneça a identificação do medicamento" });
    }

    return await Medicine.findOne({ where: { idmedicine } })
      .then(async (medicine) => {
        if (medicine) {
          await medicine.update({ name });
          return res.json({ idmedicine, name: medicine.name });
        }
        return res.status(200).json({ error: "Medicamento não identificado" });
      })
      .catch((err) => {
        if (err.errors && err.errors.length > 0) {
          return res.status(200).json({ error: err.errors[0].message });
        } else {
          return res.status(200).json({ error: err.message });
        }
      });
  }

  async remove(req, res) {
    let { idmedicine } = req.body;
    idmedicine = (idmedicine || "").toString();
    if (idmedicine === "") {
      return res
        .status(200)
        .json({ error: "Forneça a identificação do medicamento" });
    }

    return await Medicine.findOne({ where: { idmedicine } })
      .then(async (medicine) => {
        if (medicine !== null) {
          await medicine.destroy();
          return res.json({ idmedicine, name: medicine.name });
        } else {
          return res
            .status(200)
            .json({ error: "Medicamento não identificado" });
        }
      })
      .catch((err) => {
        if (err.errors && err.errors.length > 0) {
          return res.status(200).json({ error: err.errors[0].message });
        } else {
          return res.status(200).json({ error: err.message });
        }
      });
  }

  async list(req, res) {
    let { idpet } = req.body;
    idpet = (idpet || "").toString();
    let { limit, offset } = req.body;
    return await Medicine.findAndCountAll({
      where: { idpet },
      attributes: ["idmedicine", "name", "date"],
      order: [["date", "desc"], ["name","asc"]],
      offset,
      limit,
    })
      .then((medicines) => {
        return res.json({
          medicines: medicines.rows.map((item) => item.get()),
          count: medicines.count,
        });
      })
      .catch((e) => {
        return res.status(200).json({ error: e.message });
      });
  }
}

module.exports = MedicineController;
