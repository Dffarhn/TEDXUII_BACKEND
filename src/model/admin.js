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
        throw new Error('wrong password');
      }
    } else {
      throw new Error('account not found');
    }
  } else {
    throw new Error('invalid input');
  }
}

async function GetAllTransactionMerchandise() {
  try {
    const { rows } = await pool.query(
      `
      SELECT te.* , json_agg(m.*) AS data_details, json_agg(b.*) AS buyer_details
      FROM transaction_merchandise te
      JOIN merchandise m ON m.id = te.merchandise_id
      JOIN buyer b ON b.id_buyer = te.buyer_id
      WHERE te.status = 'success'
	    GROUP BY te.id, te.gross_amount,te.status,te.quantity`
    );
    return rows;
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

async function GetAllTransactionbundling() {
  try {
    const { rows } = await pool.query(
      `
      SELECT te.* , json_agg(m.*) AS data_details, json_agg(b.*) AS buyer_details
      FROM transaction_bundling te
      JOIN bundling m ON m.id = te.bundling_id
      JOIN buyer b ON b.id_buyer = te.buyer_id
      WHERE te.status = 'success'
	    GROUP BY te.id, te.gross_amount,te.status,te.quantity`
    );

    return rows;
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

async function GetAllTransactionEvents() {
  try {
    // console.log(id);
    const { rows } = await pool.query(
      `
      SELECT te.* , json_agg(e.*) AS data_details, json_agg(b.*) AS buyer_details
      FROM transaction_event te
      JOIN event e ON e.id = te.event_id
      JOIN buyer b ON b.id_buyer = te.buyer_id
      WHERE te.status = 'success'
	    GROUP BY te.id, te.gross_amount,te.status,te.quantity`
    );

    // console.log(rows)
    return rows;
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

async function CountTransactionSuccess() {
  try {
    // console.log(id);
    const { rows } = await pool.query(
      `
      SELECT 'transaction_event' AS table_name, COUNT(*) AS success_count
      FROM transaction_event
      WHERE status = 'success'
      UNION ALL
      SELECT 'transaction_bundling' AS table_name, COUNT(*) AS success_count
      FROM transaction_bundling
      WHERE status = 'success'
      UNION ALL
      SELECT 'transaction_merchandise' AS table_name, COUNT(*) AS success_count
      FROM transaction_merchandise
      WHERE status = 'success'
      `
    );
    return rows;
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

module.exports = { Add_AdminDB, check_LoginDB,GetAllTransactionMerchandise ,GetAllTransactionbundling,GetAllTransactionEvents,CountTransactionSuccess};
