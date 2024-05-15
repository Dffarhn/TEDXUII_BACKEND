const pool = require("../../db_connect.js");
const { validatorUUID, validateNumber, validateNoSpaces, validateNotNull, validateNoSpacesArray } = require("../function/Validator.js");
const { GenerateSignedUrl } = require("../function/supabaseImage.js");

async function GetAllBundling(sort = null) {
  let queryString = "SELECT b.*,json_agg(m.*) AS items_details FROM bundling b JOIN merchandise m ON m.id = ANY(b.list_bundling) GROUP BY b.id, b.name, b.stock, b.price, b.list_bundling, b.created_at";
  let queryParams = [];

  // Check if filtering by name is specified
  if (sort) {
    queryString += ` ORDER BY b.created_at ${sort === "desc" ? "DESC" : "ASC"}`;
  }
  // console.log(queryString);
  // console.log(queryParams);

  try {
    const { rows } = await pool.query(queryString, queryParams);
    // console.log(rows[0].items_details[0]);
    await Promise.all(rows[0].items_details.map(async (row,index) => {
      // console.log("masuk")
      if (row.image_merchandise[0] && row.image_merchandise.length > 0) {
        // console.log("merchandise")
        // console.log(row.image_merchandise[0])
        const signedUrl = await GenerateSignedUrl(row.image_merchandise[0]);
        if (signedUrl) {
          rows[0].items_details[index].image_merchandise[0] = signedUrl;
          // console.log(signedUrl)
        }
      }
      return row;
    }));
    return rows;
  } catch (err) {
    throw new Error("Internal Server Error");
  }
}

async function GetSpesificBundlingById(id) {
  try {
    if (validatorUUID(id)) {
      const { rows } = await pool.query("SELECT b.*,json_agg(m.*) AS items_details FROM bundling b JOIN merchandise m ON m.id= ANY(b.list_bundling) WHERE b.id = $1 GROUP BY b.id, b.name, b.stock, b.price, b.list_bundling, b.created_at", [
        id,
      ]);
      await Promise.all(rows[0].items_details.map(async (row,index) => {
        // console.log("masuk")
        if (row.image_merchandise[0] && row.image_merchandise.length > 0) {
          // console.log("merchandise")
          // console.log(row.image_merchandise[0])
          const signedUrl = await GenerateSignedUrl(row.image_merchandise[0]);
          if (signedUrl) {
            rows[0].items_details[index].image_merchandise[0] = signedUrl;
            // console.log(signedUrl)
          }
        }
        return row;
      }));
      console.log(rows);
      return rows;
    } else {
      throw new Error({ error: "Invalid input" });
    }
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}



async function AddBundlingDB(data) {
  try {
    const { name_bundling, price_bundling, stock_bundling, list_bundling, deskripsi_bundling } = data;

    const Main_Data = [name_bundling, price_bundling, stock_bundling, list_bundling,deskripsi_bundling];
    const dataString = [name_bundling,deskripsi_bundling];
    //check uuid
    list_bundling.forEach((element) => {
      if (!validatorUUID(element)) {
        throw new Error();
      }
      dataString.push(element);
    });

    const check_input_string = validateNoSpacesArray(dataString);

    const dataInteger = [price_bundling, stock_bundling];
    if (validateNumber(dataInteger)) {
      for (let i = 0; i < dataInteger.length; i++) {
        dataInteger[i] = parseInt(dataInteger[i], 10);
      }
    } else {
      throw new Error();
    }

    // console.table(Main_Data);

    if (check_input_string) {
      // Use parameterized query to prevent SQL injection
      const queryText = `
    INSERT INTO public.bundling(name, price, stock, list_bundling,deskripsi)
    VALUES ($1, $2, $3, ARRAY(SELECT unnest($4::text[])::uuid),$5)
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

async function UpdateBundlingDB(data) {
  try {
    const updateColumns = [];
    const values = [];

    Object.keys(data).forEach((key) => {
      console.table(typeof data[key]);

      if (key !== "id_bundling") {
        if (typeof data[key] == "string") {
          if (validateNoSpaces(data[key])) {
            updateColumns.push(key);
            values.push(data[key]);
          } else {
            throw new Error();
          }
        } else if (typeof data[key] === "number") {
          if (validateNumber(data[key])) {
            updateColumns.push(key);
            // Assuming price should be a number, parse it
            values.push(parseInt(data[key], 10));
          } else {
            throw new Error();
          }
        } else if (typeof data[key] === "object") {
          if (Array.isArray(data[key])) {
            // If the value is an array, iterate through each element
            data[key].forEach((uuid) => {
              if (!validatorUUID(uuid)) {
                throw new Error();
              }
              // Process each UUID here
            });
          }
          updateColumns.push(key);
          values.push(data[key]);
        } else {
          throw new Error();
        }
      }
    });

    // Periksa apakah ada kolom yang akan diupdate
    if (updateColumns.length > 0) {
      // Buat string untuk menggabungkan kolom-kolom yang akan diupdate dalam query
      const updateQuery = updateColumns
        .map((col, index) => {
          if (col === "list_bundling") {
            // Handle array column specifically
            return `${col}=ARRAY(SELECT unnest($${index + 1}::text[])::uuid)`;
          } else {
            return `${col}=$${index + 1}`;
          }
        })
        .join(", ");

      values.push(data.id_bundling);
      // Buat queryText dengan kolom-kolom yang akan diupdate
      const queryText = `
      UPDATE public.bundling
      SET ${updateQuery}
      WHERE id=$${values.length};
      `;

      const rows = await pool.query(queryText, values);

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

async function DeleteBundlingDB(id_bundlingg) {
  try {
    const data = [id_bundlingg];
    const query = `

    DELETE FROM public.bundling
	    WHERE id = $1;
    
    `;
    const { rows } = await pool.query(query, data);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { GetAllBundling, GetSpesificBundlingById, AddBundlingDB, UpdateBundlingDB, DeleteBundlingDB };
