const { Payment } = require("../models");

class PaymentController {
  async create(req, res) {
    let { idpet, description, value } = req.body;
    idpet = (idpet || "").toString();
    description = (description || "").toString().trim();
    value = (value || "").toString().replace(/[^\d\.]+/g, "");

    return await Payment.create({ idpet, description, value })
      .then(async (payment) => {
        const { idpayment, idpet, description, value, date } = payment.get();
        return res.json({ idpayment, idpet, description, value, date });
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
    let { idpayment, description, value } = req.body;
    idpayment = (idpayment || "").toString();
    description = (description || "").toString().trim();
    value = (value || "").toString().replace(/[^\d\.]+/g, "");

    if (idpayment === "") {
      return res
        .status(200)
        .json({ error: "Forneça a identificação do pagamento" });
    }

    return await Payment.findOne({ where: { idpayment } })
      .then(async (payment) => {
        if (payment) {
          await payment.update({ description, value });
          return res.json({ idpayment, description: payment.description, value: payment.value });
        }
        return res.status(200).json({ error: "Pagamento não identificado" });
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
    let { idpayment } = req.body;
    idpayment = (idpayment || "").toString();
    if (idpayment === "") {
      return res
        .status(400)
        .json({ error: "Forneça a identificação do pagamento" });
    }

    return await Payment.findOne({ where: { idpayment } })
      .then(async (payment) => {
        if (payment !== null) {
          await payment.destroy();
          return res.json({ idpayment, description: payment.description });
        } else {
          return res
            .status(200)
            .json({ error: "Pagamento não identificado" });
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
    return await Payment.findAndCountAll({
      where: { idpet },
      attributes: ["idpayment", "description", "value", "date"],
      order: [["date", "desc"],["description", "asc"]],
      offset,
      limit,
    })
      .then((payments) => {
        return res.json({
          payments: payments.rows.map((item) => item.get()),
          count: payments.count,
        });
      })
      .catch((e) => {
        return res.status(200).json({ error: e.message });
      });
  }
}

module.exports = PaymentController;
