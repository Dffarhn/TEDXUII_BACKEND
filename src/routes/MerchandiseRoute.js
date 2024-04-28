const { validateNumber, validateRequestBody, validatorUUID } = require("../function/Validator.js");
const { GetSpesificMerchandiseById, GetAllMerchandise, AddMerchandiseDB, UpdateMerchadiseDB, DeleteMerchandiseDB } = require("../model/merchandise.js");

const Get_Merchandises = async (req, res) => {
  const { sort } = req.query;
  try {
    const data = await GetAllMerchandise(sort);

    if (data.length > 0) {
      res.status(200).send(data);
    } else {
      res.status(200).send({ msg: "data tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

const Get_Merchandise = async (req, res) => {
  try {
    const { id_merchandise } = req.params;
    const data = await GetSpesificMerchandiseById(id_merchandise);

    if (data.length > 0) {
      res.status(200).send(data);
    } else {
      res.status(200).send({ msg: "data tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

const Add_Merchandise = async (req, res) => {
  try {
    const data = req.body;
    const require = ["name_merchandise", "price_merchandise", "stock_merchandise"];

    const check = validateRequestBody(data, require);
    // console.log(`checkvalid = ${check}`);

    if (check) {
      const add_data = await AddMerchandiseDB(data);
      console.log(add_data);
      if (add_data) {
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

const Update_Merchandise = async (req, res) => {
  try {
    const data_update = req.body;
    const data_id = req.params;

    if (!validatorUUID(data_id.id_merchandise)) {
      throw new Error();
    }
    const data = {
      id_merchandise: data_id.id_merchandise || null,
      name_merchandise: data_update.name_merchandise || null,
      price_merchandise : data_update.price_merchandise || null,
      stock_merchandise: data_update.stock_merchandise || null,
    };

    const hasil_update = await UpdateMerchadiseDB(data);
    if (hasil_update) {
      res.status(200).send({ msg: "Update Success", data: hasil_update });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
};

const Delete_Merchandise = async (req, res) => {
  try {
    const { id_merchandise } = req.params;
    console.log(id_merchandise)
    if (validatorUUID(id_merchandise)) {
      const hasil_delete = await DeleteMerchandiseDB(id_merchandise);

      if (hasil_delete) {
        res.status(200).send({ msg: "delete event successfully deleted" });
      }
    }else{
      res.status(500).send({ msg: "invalid type input uuid" });
      
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

module.exports = { Get_Merchandises, Get_Merchandise, Add_Merchandise, Update_Merchandise, Delete_Merchandise };
