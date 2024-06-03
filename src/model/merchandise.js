const pool = require("../../db_connect.js");
const { validatorUUID, validateNumber, validateNoSpaces, validateNotNull, validateNoSpacesArray } = require("../function/Validator.js");
const { GenerateSignedUrl, DeleteImage } = require("../function/supabaseImage.js");

async function GetAllMerchandise(sort = null) {
  let queryString = "SELECT * FROM Merchandise";
  let queryParams = [];

  // Check if filtering by name is specified
  if (sort) {
    queryString += ` ORDER BY created_at ${sort === "desc" ? "DESC" : "ASC"}`;
  }
  console.log(queryString);
  console.log(queryParams);

  try {
    const { rows } = await pool.query(queryString, queryParams);

    console.log(rows[0]);
    const rowsWithSignedUrls = await Promise.all(rows.map(async (row) => {
      console.log("masuk")
      if (row.image_merchandise && row.image_merchandise.length > 0) {
        console.log("merchandise")
        console.log(row.image_merchandise[0])
        const signedUrl = await GenerateSignedUrl(row.image_merchandise[0]);
        if (signedUrl) {
          row.image_merchandiseURL = signedUrl;
        }
      }
      return row;
    }));
    return rowsWithSignedUrls;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}

async function GetSpesificMerchandiseById(id) {
  try {
    if (validatorUUID(id)) {
      const { rows } = await pool.query("SELECT * FROM Merchandise WHERE id = $1", [id]);
      console.log(rows[0].image_merchandise[0]);
      const generateSignedUrl = await GenerateSignedUrl(rows[0].image_merchandise[0]);
      rows[0].image_merchandiseURL = generateSignedUrl
      return rows;
    } else {
      throw new Error("Invalid input");
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

// what data is {
//   name_event:(String)
//   price:(Number)
//   category:(String)
//   year:(Number)
// }

async function AddMerchandiseDB(data) {
  try {
    const { name_merchandise, price_merchandise, stock_merchandise,deskripsi_merchandise } = data;

    const Main_Data = [name_merchandise, price_merchandise, stock_merchandise, data.image_file,deskripsi_merchandise];

    const dataString = [name_merchandise,deskripsi_merchandise];

    const check_input_string = validateNoSpacesArray(dataString);

    const dataInteger = [price_merchandise, stock_merchandise];
    if (validateNumber(dataInteger)) {
      for (let i = 0; i < dataInteger.length; i++) {
        dataInteger[i] = parseInt(dataInteger[i], 10);
      }
    } else {
      throw new Error("Your data is not valid");
    }

    if (check_input_string) {
      // Use parameterized query to prevent SQL injection
      const queryText = `
        INSERT INTO public.merchandise(name, price, stock,image_merchandise,deskripsi)
        VALUES ($1, $2, $3,ARRAY[$4],$5)
         RETURNING *;
       `;
      const values = Main_Data;

      // Execute the query using parameterized values
      const { rows } = await pool.query(queryText, values);
      console.log("tes from rows");
      console.log(rows.length);
      console.log(rows);

      return rows;
    } else {
      throw new Error("Your data is not valid");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function UpdateMerchadiseDB(data) {
  try {
    const updateColumns = [];
    const values = [];

    console.log(data);

    Object.keys(data).forEach((key) => {
      if (key !== "id_merchandise") {
        if (typeof data[key] == "string") {
          if (validateNoSpaces(data[key])) {
            updateColumns.push(key);
            values.push(data[key]);
          } else {
            throw new Error("Your data is not valid");
          }
        } else {
          console.log(data[key]);
          if (validateNumber(data[key])) {
            updateColumns.push(key);
            // Assuming price should be a number, parse it
            values.push(parseInt(data[key], 10));
          } else {
            throw new Error("Your data is not valid");
          }
        }
      }
    });

    // Periksa apakah ada kolom yang akan diupdate
    if (updateColumns.length > 0) {
      // Buat string untuk menggabungkan kolom-kolom yang akan diupdate dalam query
      const updateQuery = updateColumns
        .map((col, index) => {
          if (col === "image_merchandise") {
            // Handle array column specifically
            return `${col}=ARRAY[$${index + 1}]`;
          } else {
            return `${col}=$${index + 1}`;
          }
        })
        .join(", ");

      values.push(data.id_merchandise);
      // Buat queryText dengan kolom-kolom yang akan diupdate
      const queryText = `
      UPDATE public.merchandise
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
      // console.log(rows.rowCount);
      return rows;
    } else {
      // Tidak ada kolom yang akan diupdate karena semua nilainya null
      throw new Error("No data to update boy");
    }
  } catch (error) {
    // Handle the error appropriately
    console.error("Error updating event:", error.message);
    // Optionally, you can throw the error again to propagate it to the calling function
    throw error;
  }
}

async function DeleteMerchandiseDB(id_merchandise) {
  try {
    const data = [id_merchandise];

    const getpathemail = await GetSpesificMerchandiseById(id_merchandise)

    console.log(getpathemail[0].image_merchandise)

    const deleteimagefile = await DeleteImage(getpathemail[0].image_merchandise)

    const query = `

    DELETE FROM public.merchandise
	    WHERE id = $1;
    
    `;
    const { rows } = await pool.query(query, data);
    return rows;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
}

module.exports = { GetAllMerchandise, GetSpesificMerchandiseById, AddMerchandiseDB, UpdateMerchadiseDB, DeleteMerchandiseDB };
