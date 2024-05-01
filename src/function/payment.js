const dotenv = require("dotenv");
dotenv.config();
const midtransClient = require("midtrans-client");

// let snap = new midtransClient.Snap({
//   isProduction: false,
//   serverKey: process.env.MT_SERVER_KEY,
//   clientKey: process.env.MT_CLIENT_KEY,
// });
let apiClient = new midtransClient.Snap({
    isProduction : false,
    serverKey: process.env.MT_SERVER_KEY,
    clientKey: process.env.MT_CLIENT_KEY,
});

function MidtransPayment(data) {
  return new Promise((resolve, reject) => {
    const {order_id,gross_amount,detail_data,detail_customer,created_at} = data

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
      },
      expiry: {
        "start_time": created_at,
        "unit": "hours",
        "duration": 2
      },
      page_expiry: {
        "duration": 2,
        "unit": "hours"
      },

    }

    apiClient
      .createTransaction(parameter)
      .then((transaction) => {
        resolve(transaction); // Mengembalikan URL redirect dari transaksi
      })
      .catch((err) => {
        reject(err); // Mengembalikan error jika ada kesalahan dalam pembuatan transaksi
      });
  });
}

function NotificationPayment(data) {

  apiClient.transaction.notification(data)
    .then((statusResponse)=>{
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;
        
        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        return statusResponse;
        // Sample transactionStatus handling logic

      });
      
}

function CancelPayment(data) {
  return new Promise((resolve, reject) => {
  apiClient.transaction.cancel(data.id_transaction)
    .then((response)=>{
      resolve (response)
    });
  }) 
}

module.exports = {MidtransPayment,NotificationPayment,CancelPayment}
      // if (transactionStatus == 'capture'){
      //     // capture only applies to card transaction, which you need to check for the fraudStatus
      //     if (fraudStatus == 'challenge'){
      //         // TODO set transaction status on your databaase to 'challenge'
      //     } else if (fraudStatus == 'accept'){
      //         // TODO set transaction status on your databaase to 'success'
      //     }
      // } else if (transactionStatus == 'settlement'){
      //     // TODO set transaction status on your databaase to 'success'
      // } else if (transactionStatus == 'deny'){
      //     // TODO you can ignore 'deny', because most of the time it allows payment retries
      //     // and later can become success
      // } else if (transactionStatus == 'cancel' ||
      //   transactionStatus == 'expire'){
      //     // TODO set transaction status on your databaase to 'failure'
      // } else if (transactionStatus == 'pending'){
      //     // TODO set transaction status on your databaase to 'pending' / waiting payment
      // }