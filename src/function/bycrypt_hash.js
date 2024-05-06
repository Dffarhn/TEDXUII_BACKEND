const bcrypt = require("bcrypt");

function bcrypt_data(data) {
  const saltRounds = 10;
  const passwordToHash = data;

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.error("Error generating salt:", err);
        reject(err);
      }

      bcrypt.hash(passwordToHash, salt, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          reject(err);
        }
        resolve(hashedPassword);
      });
    });
  });
}

module.exports = { bcrypt_data };
