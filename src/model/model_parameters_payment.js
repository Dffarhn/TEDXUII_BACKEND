// Di dalam file paymentData.js

const { validateNumber, validateEmail, validateNoSpacesArray } = require("../function/Validator.js");

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
  },
};

function MakePaymentData(data) {
  const StringInput = [
    data.id,
    data.detail_customer[0].first_name,
    data.detail_customer[0].last_name,
    data.detail_customer[0].address,
    data.event_details[0].id_event,
    data.event_details[0].name_event,
    data.event_details[0].category,
  ];


  const IntegerInput = [
    data.gross_amount,
    data.data.event_details[0].price,
    data.quantity,
    data.detail_customer[0].phone_number,
  ];

  const EmailInput = [data.detail_customer[0].email];

  // Perform validation and handle errors
  if (!validateNoSpacesArray(StringInput)) {
    throw new Error("String inputs must not contain spaces.");
  }
  if (!validateNumber(IntegerInput)) {
    throw new Error("Invalid phone number format.");
  }
  if (!validateEmail(EmailInput)) {
    throw new Error("Invalid email format.");
  }


  let PaymentData = {
    order_id: data.id,
    gross_amount: data.gross_amount,
    detail_data: {
      id: data.event_details[0].id_event,
      price: data.event_details[0].price,
      quantity: data.quantity,
      name: data.event_details[0].name_event,
      category: data.event_details[0].category,
    },
    detail_customer: {
      first_name: data.buyer_details[0].first_name,
      last_name: data.buyer_details[0].last_name,
      email: data.buyer_details[0].email,
      phone_number: data.buyer_details[0].phone_number,
      address: data.buyer_details[0].address,
    },
  };

  return PaymentData
  
}


module.exports = {  MakePaymentData };
