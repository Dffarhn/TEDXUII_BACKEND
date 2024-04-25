const pool = require("../../db_connect.js");
const { validatorUUID, validateNumber } = require("../function/Validator.js");

async function GetAllEvent(sort = null, year = null, name = null) {
  let queryString = "SELECT * FROM event";
  let queryParams = [];

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
    queryString += ` name_event LIKE '%' || $${queryParams.length + 1} || '%'`;
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
      const { rows } = await pool.query("SELECT * FROM Event WHERE id_event = $1", [id]);
      console.log(rows);
      return rows;
    } else {
      throw new Error({ error: "Invalid input" });
    }
  } catch (err) {
    throw new Error({ error: "Internal Server Error" });
  }
}

module.exports = { GetAllEvent, GetSpesificEventById };
