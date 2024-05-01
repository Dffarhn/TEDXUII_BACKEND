// Di dalam file paymentData.js

const { validateNumber, validateEmail, validateNoSpacesArray } = require("../function/Validator.js");

function MakePaymentData(data) {
  const StringInput = [
    data.buyer_details[0].username,
    data.buyer_details[0].address,
    data.event_details[0].id_event,
    data.event_details[0].name_event,
    data.buyer_details[0].phone_number,
  ];
  
  console.log(data)

  console.log(StringInput);
  

  const IntegerInput = [
    data.id,
    data.event_details[0].category,
    parseInt(data.gross_amount,10),
    data.event_details[0].price,
    data.quantity,
  ];

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
      id: data.event_details[0].id_event,
      price: data.event_details[0].price,
      quantity: data.quantity,
      name: data.event_details[0].name_event,
      category: data.event_details[0].category,
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
      duration: 2
    },
    page_expiry: {
      duration: 2,
      unit: "hours"
    },
  };

  console.log(PaymentData)

  return PaymentData
  
}


module.exports = {  MakePaymentData };
