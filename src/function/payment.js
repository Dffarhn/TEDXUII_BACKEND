const dotenv = require("dotenv");
dotenv.config();
const midtransClient = require("midtrans-client");

function MidtransPayment(data) {
  return new Promise((resolve, reject) => {
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MT_SERVER_KEY,
      clientKey: process.env.MT_CLIENT_KEY,
    });

    const {order_id,gross_amount,detail_data,detail_customer} = data

    let parameter = {
      transaction_details: {
        "order_id": order_id,
        "gross_amount": gross_amount
      },
      item_details: [{
        "id": detail_data.id,
        "price": detail_data.price,
        "quantity": detail_data.quantity,
        "name": detail_data.name,
        "category": detail_data.category,
      }],
      customer_details: {
        "first_name": detail_customer.first_name,
        "last_name": detail_customer.last_name,
        "email": detail_customer.email,
        "phone": detail_customer.phone_number,
        "billing_address": {
          "first_name": detail_customer.first_name,
          "last_name": detail_customer.last_name,
          "email": detail_customer.email,
          "phone": detail_customer.phone_number,
          "address": detail_customer.address,
          "city": detail_customer.city,
          "country_code": "IDN"
        },
      }

    }

    snap
      .createTransaction(parameter)
      .then((transaction) => {
        let redirectUrl = transaction.redirect_url;
        resolve(redirectUrl); // Mengembalikan URL redirect dari transaksi
      })
      .catch((err) => {
        reject(err); // Mengembalikan error jika ada kesalahan dalam pembuatan transaksi
      });
  });
}

module.exports = {MidtransPayment}