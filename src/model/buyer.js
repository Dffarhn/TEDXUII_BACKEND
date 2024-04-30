const pool = require("../../db_connect.js");
const { validateNumber, validateEmail, validateNoSpacesArray } = require("../function/Validator.js");


async function AddBuyerDB(data) {
    try {
      const { username, email, phone_number, address } = data;
  
      const Main_Data = [username, email, phone_number, address ];
  
      const dataString = [username, address,phone_number];
  
      const check_input_string = validateNoSpacesArray(dataString);
  
      const phone_number_test = parseInt(phone_number, 10);
  
      const dataInteger=[phone_number_test]
  
      const check_input_integer = validateNumber(dataInteger);

      const check_input_email = validateEmail(email);
  
      if (check_input_integer && check_input_string && check_input_email) {
        // Use parameterized query to prevent SQL injection
        const queryText = `
           INSERT INTO buyer(username, email, phone_number, address)
           VALUES ($1, $2, $3, $4)
           RETURNING *;
         `;
        const values = Main_Data;
  
        // Execute the query using parameterized values
        const { rows } = await pool.query(queryText, values);
  
        return rows;
      } else {
        throw new Error({ error: "Internal Server Error" });
      }
    } catch (error) {
      console.log(error);
      throw new Error({ error: "Internal Server Error" });
    }
}

module.exports ={AddBuyerDB}
  