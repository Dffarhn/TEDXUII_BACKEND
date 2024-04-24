// Di dalam file paymentData.js

const { validateNoSpaces, validatePhoneNumber, validateEmail } = require("../function/Validator.js");

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

function updateParametersData(data) {
    // Update objek PaymentData sesuai dengan data yang diterima dari req.body
    const updatedData = {
      ...PaymentData, // Copy existing data
      ...data, // Update with new data from req.body
    };
  
    // Extract input values for validation
    const StringInput = [
      updatedData.order_id,
      updatedData.detail_customer.first_name,
      updatedData.detail_customer.last_name,
      updatedData.detail_customer.address,
      updatedData.detail_data.id,
      updatedData.detail_data.name,
      updatedData.detail_data.category,
    ];
  
    const IntegerInput = [
      updatedData.gross_amount,
      updatedData.detail_data.price,
      updatedData.detail_data.quantity,
      updatedData.detail_customer.phone_number,
    ];
  
    const EmailInput = [updatedData.detail_customer.email];
  
    // Perform validation and handle errors
    const errors = [];
    if (!validateNoSpaces(StringInput)) {
      errors.push("String inputs must not contain spaces.");
    }
    if (!validatePhoneNumber(IntegerInput)) {
      errors.push("Invalid phone number format.");
    }
    if (!validateEmail(EmailInput)) {
      errors.push("Invalid email format.");
    }
  
    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  
    // If validation passes, update PaymentData and return it
    PaymentData = updatedData;
    return PaymentData;
  }

module.exports = { PaymentData, updateParametersData };
