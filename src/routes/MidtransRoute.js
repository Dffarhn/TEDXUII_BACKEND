const { updateParametersData, MakePaymentData } = require("../model/model_parameters_payment.js");
const { v4: uuidv4 } = require("uuid");
const { MidtransPayment } = require("../function/payment.js");
const { GetSpesificEventById } = require("../model/event.js");

async function Midtrans_Payment (dataDB){
  try {
    const data = dataDB[0];
    console.log(data);

    const data_transaction = MakePaymentData(data)

    

    //generate order id lalu masukkan ke const data di paling awal
    // data.order_id = uuidv4()//gaperlu


    // data.gross_amount = parseInt(data.detail_data.price, 10)*parseInt(data.detail_data.quantity, 10);
    // console.log(data)



    // const data_order = updateParametersData(data)

    const respones_midtrans = await MidtransPayment(data_transaction); // Memanggil fungsi MidtransPayment secara asynchronous
    if (respones_midtrans) {
      return respones_midtrans// Mengirimkan URL redirect sebagai respons
    }
  } catch (error) {
    res.status(500).send({ error: error.message }); // Mengirimkan pesan error jika terjadi kesalahan
  }
  
} 


module.exports ={Midtrans_Payment}