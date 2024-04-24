const { Router } = require("express");
const { MidtransPayment } = require("../function/payment.js");
const { PaymentData, updateParametersData } = require("../model/model_parameters_payment.js");
const { v4: uuidv4 } = require("uuid");

const route = Router();

route.post("/", async (req, res) => {
  try {
    const data = req.body;

    //generate order id lalu masukkan ke const data di paling awal
    data.order_id = uuidv4();
    const data_order = updateParametersData(data);
    console.log(data_order);
    const redirectUrl = await MidtransPayment(data_order); // Memanggil fungsi MidtransPayment secara asynchronous
    res.send({ redirectUrl: redirectUrl }); // Mengirimkan URL redirect sebagai respons
  } catch (error) {
    res.status(500).send({ error: error.message }); // Mengirimkan pesan error jika terjadi kesalahan
  }
});

module.exports = { route };
