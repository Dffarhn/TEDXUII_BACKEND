const dotenv = require("dotenv");
dotenv.config();
const midtransClient = require("midtrans-client");


let apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MT_SERVER_KEY,
  clientKey: process.env.MT_CLIENT_KEY,
});

function MidtransPayment(data) {
  return new Promise((resolve, reject) => {
    const { order_id, gross_amount, detail_data, detail_customer, created_at, custom_field1 } = data;
    // console.log(custom_field1)

    let parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      item_details: [
        {
          id: detail_data.id,
          price: detail_data.price,
          quantity: detail_data.quantity,
          name: detail_data.name,
        },
      ],
      customer_details: {
        first_name: detail_customer.first_name,
        last_name: detail_customer.last_name,
        email: detail_customer.email,
        phone: detail_customer.phone_number,
        billing_address: {
          first_name: detail_customer.first_name,
          last_name: detail_customer.last_name,
          email: detail_customer.email,
          phone: detail_customer.phone_number,
          address: detail_customer.address,
          city: detail_customer.city,
          country_code: "IDN",
        },
      },
      expiry: {
        start_time: created_at,
        unit: "hours",
        duration: 1,
      },
      page_expiry: {
        duration: 7,
        unit: "minutes",
      },
      callbacks: {
        "finish": "https://tedxuiibackend-production.up.railway.app/transaction/cancel/v1",
        "unfinish": "https://tedxuiibackend-production.up.railway.app/transaction/cancel/v1"
      },

      custom_field1: custom_field1,
    };

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
  return new Promise((resolve, reject) => {
    apiClient.transaction.notification(data).then((statusResponse) => {
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

      resolve(statusResponse);
      // Sample transactionStatus handling logic
    });
  });
}

function CancelPayment(data) {
  return new Promise((resolve, reject) => {
    apiClient.transaction.cancel(data).then((response) => {
      resolve(response);
    });
  });
}

function ExpiredPayment(data) {
  return new Promise((resolve, reject) => {
    apiClient.transaction.expire(data.id_transaction).then((response) => {
      resolve(response);
    });
  });
}

function Cek_Notification(data) {
  const transactionStatus = data.transaction_status;

  if (transactionStatus == "settlement") {
    return "success";
  } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
    return "failed";
  } else if (transactionStatus == "pending") {
    return "pending";
  } else {
    return "unknown";
  }
}

module.exports = { MidtransPayment, NotificationPayment, CancelPayment, Cek_Notification, ExpiredPayment };
