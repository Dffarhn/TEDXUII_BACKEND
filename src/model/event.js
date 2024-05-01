const pool = require("../../db_connect.js");
const { validatorUUID, validateNumber, validateNoSpaces, validateNotNull, validateNoSpacesArray } = require("../function/Validator.js");

async function GetAllEvent(sort = null, year = null, name = null) {
  let queryString = "SELECT event.*, category.nama_category AS category_name FROM event";
  let queryParams = [];

  // Join the category table
  queryString += " LEFT JOIN category ON event.category = category.id";

  // Check if filtering by year is specified
  if (year) {
    if (validateNumber(year)) {
      queryString += queryParams.length === 0 ? " WHERE" : " AND";
      queryString += ` year = $${queryParams.length + 1}`;
      queryParams.push(year);
    }
  }

  // Check if filtering by name is specified
  if (name) {
    queryString += queryParams.length === 0 ? " WHERE" : " AND";
    queryString += ` name LIKE '%' || $${queryParams.length + 1} || '%'`;
    queryParams.push(name);
  }

  if (sort) {
    queryString += ` ORDER BY created_at ${sort === "desc" ? "DESC" : "ASC"}`;
  }
  console.log(queryString);
  console.log(queryParams);

  try {
    const { rows } = await pool.query(queryString, queryParams);
    return rows;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}

async function GetSpesificEventById(id) {
  try {
    if (validatorUUID(id)) {
      const { rows } = await pool.query("SELECT * FROM Event WHERE id = $1", [id]);
      // console.log(rows[0]);
      return rows;
    } else {
      throw new Error({ error: "Invalid input" });
    }
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

// what data is {
//   name_event:(String)
//   price:(Number)
//   category:(String)
//   year:(Number)
// }

async function AddEventDB(data) {
  try {
    const { name, price, category, year,stock } = data;

    const Main_Data = [name, price, category, year,stock];

    const dataString = [name, year];

    const check_input_string = validateNoSpacesArray(dataString);

    const price_data = parseInt(price, 10);

    const category_data = parseInt(category, 10);

    const stock_data = parseInt(stock, 10);

    const dataInteger=[price_data, category_data,stock_data]

    const check_input_integer = validateNumber(dataInteger);

    if (check_input_integer && check_input_string) {
      // Use parameterized query to prevent SQL injection
      const queryText = `
         INSERT INTO event(name, price, category, year,stock)
         VALUES ($1, $2, $3, $4,$5)
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

async function UpdateEventDB(data) {
  try {
    const updateColumns = [];
    const values = [];

    console.log(data);

    Object.keys(data).forEach((key) => {
      console.table(typeof data[key]);

      if (key !== "id_event") {
        if (typeof data[key] == "string") {
          if (validateNoSpaces(data[key])) {
            updateColumns.push(key);
            values.push(data[key]);
          }else{
            throw new Error
          }
        } else {
          if (validateNumber(data[key])) {
            updateColumns.push(key);
            // Assuming price should be a number, parse it
            values.push(parseInt(data[key], 10));
          }else{
            throw new Error
          }
        }
      }
    });

    // Periksa apakah ada kolom yang akan diupdate
    if (updateColumns.length > 0) {
      // Buat string untuk menggabungkan kolom-kolom yang akan diupdate dalam query
      const updateQuery = updateColumns.map((col, index) => `${col}=$${index + 1}`).join(", ");

      values.push(data.id_event);
      // Buat queryText dengan kolom-kolom yang akan diupdate
      const queryText = `
      UPDATE public.event
      SET ${updateQuery}
      WHERE id=$${values.length};
      `;

      // Tambahkan id_event ke values array

      console.log("Update query:", queryText);
      console.log("Values:", values);
      // Execute your database update query using the queryText and values
      // Example:
      const rows = await pool.query(queryText, values);

      // Return success message or updated data
      console.log(rows.rowCount);
      return rows;
    } else {
      // Tidak ada kolom yang akan diupdate karena semua nilainya null
      throw new Error("No data to update");
    }
  } catch (error) {
    // Handle the error appropriately
    console.error("Error updating event:", error.message);
    // Optionally, you can throw the error again to propagate it to the calling function
    throw error;
  }
}

async function DeleteEventDB(id_event) {
  try {
    const data = [id_event];
    const query = `

    DELETE FROM public.event
	    WHERE id = $1;
    
    `;
    const { rows } = await pool.query(query, data);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { GetAllEvent, GetSpesificEventById, AddEventDB, UpdateEventDB, DeleteEventDB };
