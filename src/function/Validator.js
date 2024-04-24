function validateEmail(emails) {
  // Check if each email in the array matches the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.every((email) => emailRegex.test(email));
}

function validateNoSpaces(inputs) {
  // Check if each input in the array contains any non-whitespace characters
  return inputs.every((input) => input.trim().length > 0);
}

function validatePhoneNumber(phoneNumbers) {
  // Regular expression to allow only digits
  const phoneRegex = /^[0-9]+$/;
  return phoneNumbers.every((phone) => phoneRegex.test(phone));
}

module.exports = { validateEmail, validateNoSpaces, validatePhoneNumber };
