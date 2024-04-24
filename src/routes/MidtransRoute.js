const { updateParametersData } = require("../model/model_parameters_payment.js");
const { v4: uuidv4 } = require("uuid");
const { MidtransPayment } = require("../function/payment.js");

const Midtrans_Payment = async (req, res) => {
    try {
      const data = req.body;
  
      //generate order id lalu masukkan ke const data di paling awal
      data.order_id = uuidv4()
      data.gross_amount = parseInt(data.detail_data.price, 10)*parseInt(data.detail_data.quantity, 10);
      console.log(data)
      const data_order = updateParametersData(data);
      console.log(data_order);
      const respones_midtrans = await MidtransPayment(data_order); // Memanggil fungsi MidtransPayment secara asynchronous
      res.send({ msg : "success make a payment",data: data_order, Midtrans: respones_midtrans }); // Mengirimkan URL redirect sebagai respons
    } catch (error) {
      res.status(500).send({ error: error.message }); // Mengirimkan pesan error jika terjadi kesalahan
    }
  }


module.exports ={Midtrans_Payment}