const { client } = require("../../redis_connect.js");
const { validateNumber, validateRequestBody, validatorUUID } = require("../function/Validator.js");
const { flushKeysStartingWith } = require("../function/redisflushupdate.js");
const { GetAllBundling, GetSpesificBundlingById, AddBundlingDB, UpdateBundlingDB, DeleteBundlingDB } = require("../model/bundling.js");
const { GetSpesificMerchandiseById, GetAllMerchandise, AddMerchandiseDB, UpdateMerchadiseDB, DeleteMerchandiseDB } = require("../model/merchandise.js");

const Get_Bundlings = async (req, res) => {
  const { sort } = req.query;
  const cacheKey = `bundlings_${sort || "default"}`;
  try {
    const data = await GetAllBundling(sort);

    if (data.length > 0) {
      await client.setEx(cacheKey, 3600, JSON.stringify(data));
      res.status(200).send(data);
    } else {
      res.status(200).send({ msg: "data tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

const Get_Bundling = async (req, res) => {
  try {
    const { id_bundling } = req.params;
    const data = await GetSpesificBundlingById(id_bundling);

    if (data.length > 0) {
      res.status(200).send(data);
    } else {
      res.status(200).send({ msg: "data tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

const Add_Bundling = async (req, res) => {
  try {
    const data = req.body;
    const require = ["name_bundling", "price_bundling", "stock_bundling", "list_bundling"];

    const check = validateRequestBody(data, require);
    // console.log(`checkvalid = ${check}`);

    if (check) {
      const add_data = await AddBundlingDB(data);
      console.log(add_data);
      if (add_data) {
        await flushKeysStartingWith("bundling");
        res.status(201).send({ msg: "Sucessfully added", data: add_data });
      }
    } else {
      res.status(500).send({ msg: "your data is not valid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
};

const Update_Bundling = async (req, res) => {
  try {
    const data_update = req.body;
    const data_id = req.params;

    if (!validatorUUID(data_id.id_bundling)) {
      throw new Error();
    }
    const data = {
      id_bundling: data_id.id_bundling || null,
      name: data_update.name || null,
      price: data_update.price || null,
      stock: data_update.stock || null,
      list_bundling: data_update.list_bundling || null,
    };
    const filteredData = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null));

    const hasil_update = await UpdateBundlingDB(filteredData);
    if (hasil_update) {
      await flushKeysStartingWith("bundling");
      res.status(200).send({ msg: "Update Success", data: hasil_update });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
};

const Delete_Bundling = async (req, res) => {
  try {
    const { id_bundling } = req.params;
    console.log(id_bundling);
    if (validatorUUID(id_bundling)) {
      const hasil_delete = await DeleteBundlingDB(id_bundling);

      if (hasil_delete) {
        await flushKeysStartingWith("bundling");
        res.status(200).send({ msg: "delete event successfully deleted" });
      }
    } else {
      res.status(500).send({ msg: "invalid type input uuid" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

module.exports = { Get_Bundlings, Get_Bundling, Add_Bundling, Update_Bundling, Delete_Bundling };
