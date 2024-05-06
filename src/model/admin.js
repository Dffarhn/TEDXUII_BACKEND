const pool = require("../../db_connect.js");
const bcrypt = require("bcrypt");
const { validateNoSpacesArray, validateEmail } = require("../function/Validator.js");
const { bcrypt_data } = require("../function/bycrypt_hash.js");

async function Add_AdminDB(data) {
  try {
    const { username, email, password } = data;
    const stringinput = [username, password];
    const emailinput = email;
    const checkstringinput = validateNoSpacesArray(stringinput);
    const checkemailinput = validateEmail(emailinput);
    const checksameemail = await check_AdminDB(email);

    if (checkstringinput && checkemailinput) {
      if (checksameemail.length > 0) {
        throw new Error("Admin dengan email ini sudah terdaftar.");
      } else {
        const passwordToDB = await bcrypt_data(password);
        const queryText = `
          INSERT INTO public.admin(username, email, password) VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [username, emailinput, passwordToDB];
        const { rows } = await pool.query(queryText, values);
        console.log("Executed query:", queryText, values);
        console.log("Rows affected:", rows.length);
        return rows[0]; // Assuming rows[0] contains the inserted record
      }
    } else {
      throw new Error("Invalid input.");
    }
  } catch (error) {
    console.error("Error in Add_AdminDB:", error);
    throw new Error("Terjadi kesalahan dalam proses pembuatan admin.");
  }
}
async function check_AdminDB(email) {
  return new Promise((resolve, reject) => {
    const checkemailinput = validateEmail(email);
    if (checkemailinput) {
      const queryText = `
            SELECT * FROM public.admin
            WHERE email = $1;
          `;
      pool
        .query(queryText, [email])
        .then(({ rows }) => {
          console.log(rows);
          resolve(rows); // Resolve with true if admin with this email exists
        })
        .catch((err) => {
          console.error("Error querying database:", err);
          reject(err);
        });
    } else {
      resolve(false); // Invalid email input
    }
  });
}

async function check_LoginDB(data) {
  const { email, password } = data;
  const stringinput = [password];

  const emailinput = email;

  const checkstringinput = validateNoSpacesArray(stringinput);

  const checkemailinput = validateEmail(emailinput);

  if (checkstringinput && checkemailinput) {
    const cek_admin = await check_AdminDB(email);

    if (cek_admin.length > 0) {
      const samepassword = await bcrypt.compare(password, cek_admin[0].password);

      if (samepassword) {
        return cek_admin[0];
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

module.exports = { Add_AdminDB, check_LoginDB };
