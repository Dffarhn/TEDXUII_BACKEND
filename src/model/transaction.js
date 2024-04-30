const pool = require("../../db_connect.js");
const { validatorUUID, validateNumber, validateNoSpaces, validateNotNull, validateNoSpacesArray } = require("../function/Validator.js");

async function GetSpesificTransactionById(id) {
  try {
      console.log(id)
      const { rows } = await pool.query(`
      SELECT te.* , json_agg(e.*) AS event_details, json_agg(b.*) AS buyer_details
      FROM transaction_event te
      JOIN event e ON e.id_event = te.event_id
      JOIN buyer b ON b.id_buyer = te.buyer_id
      WHERE te.id = $1
	    GROUP BY te.id, te.gross_amount,te.status,te.quantity`, [id]);
      return rows;
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

async function AddEventTransactionDB(data,data_event,data_buyer) {
    try {

      console.log(data_event.stock)
      const { id_event, quantity } = data;

      if (data_event.stock > 0 && data_event.stock >= quantity) {
        console.log("hitascsacasc")
        
        const Main_Data = [id_event, data_buyer.id_buyer, quantity];
        const dataString = [id_event, data_buyer.id_buyer];
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
  
        const gross_amount = data_event.price * quantity;
        Main_Data.push((gross_amount))
  
        // status
        // pending, failed, completed
        if (check_input_string) {
          Main_Data.push("pending")
          Main_Data.push(data_event.stock - quantity)
          // Use parameterized query to prevent SQL injection
          const queryText_transaction = `
        INSERT INTO public.transaction_event(event_id, buyer_id, quantity, gross_amount, status)
        VALUES ($1, $2, $3, $4,$5 )
        RETURNING *;
          `;
  
          const queryText_updateEvent = 
          `UPDATE public.event 
          SET stock = $2 
          Where id_event = $1;
          `
  
  
          
          const values = Main_Data;
          console.log(values);
    
          // Execute the query using parameterized values
          const { rows } = await pool.query(queryText_transaction, values.slice(0,5));
  
                          await pool.query(queryText_updateEvent, [values.at(0),values.at(values.length-1)])
  
  
          if (rows) {
            console.log(rows[0].id);
            const dataSpesific = await GetSpesificTransactionById(rows[0].id);
            return dataSpesific
              
          }
        } else {
          throw new Error({ error: "Internal Server Error" });
        }
      }else{
        throw new Error({ error: "Internal Server Error" });

      }
  
    } catch (error) {
      console.log(error);
      throw new Error({ error: "Internal Server Error" });
    }
  }

module.exports = {AddEventTransactionDB, GetSpesificTransactionById}