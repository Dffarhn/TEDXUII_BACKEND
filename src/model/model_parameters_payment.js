// Di dalam file paymentData.js

let PaymentData = {
  order_id: "",
  gross_amount: 0,
  detail_data: {
    id: "",
    price: 0,
    quantity: 0,
    name: "",
    category: "",
  },
  detail_customer: {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
  },
};

function updateParametersData(data) {
  // Update objek PaymentData sesuai dengan data yang diterima dari req.body
  PaymentData = {
    ...PaymentData, // Copy existing data
    ...data, // Update with new data from req.body
  };

  return PaymentData;
}

module.exports = { PaymentData, updateParametersData };
