const pool = require("../../db_connect.js");
const { validatorUUID, validateNumber, validateNoSpaces, validateNotNull, validateNoSpacesArray } = require("../function/Validator.js");
const { sendEmail } = require("../function/mailjet.js");
const { flushKeysStartingWith } = require("../function/redisflushupdate.js");
const { UpdateMerchadiseDB } = require("./merchandise.js");

async function GetSpesificTransactionMerchandiseById(id) {
  try {
    console.log(id);
    const { rows } = await pool.query(
      `
      SELECT te.* , json_agg(m.*) AS data_details, json_agg(b.*) AS buyer_details
      FROM transaction_merchandise te
      JOIN merchandise m ON m.id = te.merchandise_id
      JOIN buyer b ON b.id_buyer = te.buyer_id
      WHERE te.id = $1
	    GROUP BY te.id, te.gross_amount,te.status,te.quantity`,
      [id]
    );
    return rows;
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

async function AddMerchandiseTransactionDB(data, data_merchandise, data_buyer) {
  try {
    // console.log(data_merchandise.stock);
    const { id_merchandise, quantity } = data;

    if (data_merchandise.stock > 0 && data_merchandise.stock >= quantity) {
      // console.log("hitascsacasc");

      const Main_Data = [id_merchandise, data_buyer.id_buyer, quantity];
      const dataString = [id_merchandise, data_buyer.id_buyer];
      //check uuid
      dataString.forEach((element) => {
        if (!validatorUUID(element)) {
          throw new Error();
        }
      });

      const check_input_string = validateNoSpacesArray(dataString);

      const dataInteger = [quantity];
      if (validateNumber(dataInteger)) {
        for (let i = 0; i < dataInteger.length; i++) {
          dataInteger[i] = parseInt(dataInteger[i], 10);
        }
      } else {
        throw new Error();
      }

      const gross_amount = data_merchandise.price * quantity;
      Main_Data.push(gross_amount);

      // status
      // pending, failed, completed
      if (check_input_string) {
        Main_Data.push(data_merchandise.stock - quantity);
        // Use parameterized query to prevent SQL injection
        const queryText_transaction = `
        INSERT INTO public.transaction_merchandise(merchandise_id, buyer_id, quantity, gross_amount)
        VALUES ($1, $2, $3, $4 )
        RETURNING *;
          `;

        const queryText_updateEvent = `UPDATE public.merchandise 
          SET stock = $2 
          Where id = $1;
          `;

        const values = Main_Data;
        // console.log(values);

        // Execute the query using parameterized values
        const { rows } = await pool.query(queryText_transaction, values.slice(0, 4));

        await pool.query(queryText_updateEvent, [values.at(0), values.at(values.length - 1)]);

        if (rows) {
          console.log(rows[0].id);
          const dataSpesific = await GetSpesificTransactionMerchandiseById(rows[0].id);

          // console.log("HITTTTTTTTTTTTTTTTTTTTTTTTT");
          return dataSpesific;
        }
      } else {
        throw new Error({ error: "Internal Server Error" });
      }
    } else {
      throw new Error({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.log(error);
    throw new Error({ error: "Internal Server Error" });
  }
}

async function UpdateMerchandiseTransactionDB(id, status_data) {
  try {
    const values = [status_data, id];

    const queryText = `
      UPDATE public.transaction_merchandise
      SET status = $1
      WHERE id=$${values.length};
      `;

    // Tambahkan id_merchandise ke values array

    // console.log("Update query:", queryText);
    // console.log("Values:", values);
    // Execute your database update query using the queryText and values
    // Example:
    const rows = await pool.query(queryText, values);

    if (status_data === "failed") {
      const update_stock = await GetSpesificTransactionMerchandiseById(id);

      const stock_failed = parseInt(update_stock[0].quantity, 10);

      const stock_now = parseInt(update_stock[0].data_details[0].stock, 10);

      const stock_rollback = stock_now + stock_failed;

      const id_merchandise = update_stock[0].data_details[0].id;

      const data = {
        id_merchandise: id_merchandise,
        stock: stock_rollback,
      };

      const update_failed_payment = await UpdateMerchadiseDB(data);

      await flushKeysStartingWith("merchandise");
      return rows;
    } else {
      const transaction_completed = await GetSpesificTransactionMerchandiseById(id);

      const sendMail = sendEmail(transaction_completed[0],"merchandise");
      return rows;
    }

    return rows;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { AddMerchandiseTransactionDB, GetSpesificTransactionMerchandiseById, UpdateMerchandiseTransactionDB };
