function validateEmail(emails) {
  // Check if each email in the array matches the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.every((email) => emailRegex.test(email));
}

function validateNoSpaces(inputs) {
  // Check if each input in the array contains any non-whitespace characters
  return inputs.every((input) => input.trim().length > 0);
}

function validateNumber(phoneNumbers) {
  // Regular expression to allow only digits
  const phoneRegex = /^[0-9]+$/;
  return phoneNumbers.every((phone) => phoneRegex.test(phone));
}

function validatorUUID(uuid) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}

function validatorAdmin(token) {


  
}

function validateRequestBody(body, requiredFields) {
  for (const field of requiredFields) {
    if (!body[field] || body[field].trim() === '') {
      return `${field} is required and must not be empty.`;
    }
  }
  return null; // Return null if all required fields are present and not empty
}


module.exports = { validateEmail, validateNoSpaces, validateNumber, validatorUUID,validatorAdmin,validateRequestBody };
