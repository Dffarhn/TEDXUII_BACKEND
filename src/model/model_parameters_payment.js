// Di dalam file paymentData.js

const { validateNumber, validateEmail, validateNoSpacesArray } = require("../function/Validator.js");

function MakePaymentData(data) {
  const StringInput = [data.id, data.category, data.buyer_details[0].username, data.buyer_details[0].address, data.data_details[0].id, data.data_details[0].name, data.buyer_details[0].phone_number];

  // console.log(data)

  // console.log(StringInput);

  const IntegerInput = [parseInt(data.gross_amount, 10), data.data_details[0].price, data.quantity];

  const EmailInput = data.buyer_details[0].email;

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
      id: data.data_details[0].id,
      price: data.data_details[0].price,
      quantity: data.quantity,
      name: data.size ? `${data.data_details[0].name} ${data.size}` : data.data_details[0].name,
    },
    detail_customer: {
      first_name: data.buyer_details[0].username,
      email: data.buyer_details[0].email,
      phone_number: data.buyer_details[0].phone_number,
      address: data.buyer_details[0].address,
    },
    expiry: {
      start_time: data.created_at,
      unit: "hours",
      duration: 2,
    },
    page_expiry: {
      duration: 2,
      unit: "hours",
    },
    custom_field1: data.category,
  };

  // console.log(PaymentData)

  return PaymentData;
}

module.exports = { MakePaymentData };
