const { MakePaymentData } = require("../model/model_parameters_payment.js");
const { MidtransPayment } = require("../function/payment.js");

async function Midtrans_Payment(dataDB) {
  try {
    const data = dataDB[0];

    const data_transaction = MakePaymentData(data);
    // console.log(data_transaction);

    const respones_midtrans = await MidtransPayment(data_transaction); // Memanggil fungsi MidtransPayment secara asynchronous
    if (respones_midtrans) {
      return respones_midtrans; // Mengirimkan URL redirect sebagai respons
    }
  } catch (error) {
    throw new Error(); // Mengirimkan pesan error jika terjadi kesalahan
  }
}

module.exports = { Midtrans_Payment };
