const { Router } = require("express");
const { MidtransPayment } = require("../function/payment.js");
const { PaymentData, updateParametersData } = require("../model/model_parameters_payment.js");
const { v4: uuidv4 } = require("uuid");
const { validatePhoneNumber } = require("../function/Validator.js");

const route = Router();




//Midtrans Payment routes
route.post("/", async (req, res) => {
  try {
    const data = req.body;

    //generate order id lalu masukkan ke const data di paling awal
    data.order_id = uuidv4();
    data.gross_amount = parseInt(data.detail_data.price, 10)*parseInt(data.detail_data.quantity, 10);
    const data_order = updateParametersData(data);
    // console.log(data_order);
    const redirectUrl = await MidtransPayment(data_order); // Memanggil fungsi MidtransPayment secara asynchronous
    res.send({ msg : "success make a payment",data: data_order, redirectUrl: redirectUrl }); // Mengirimkan URL redirect sebagai respons
  } catch (error) {
    res.status(500).send({ error: error.message }); // Mengirimkan pesan error jika terjadi kesalahan
  }
});

module.exports = { route };
