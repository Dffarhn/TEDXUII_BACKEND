const { validateNumber,validateRequestBody } = require("../function/Validator.js");
const { GetAllEvent, GetSpesificEventById, AddEventDB, UpdateEventDB } = require("../model/event.js");

const Get_Events = async (req, res) => {
  const { sort, year, name } = req.query;
  try {
    const data = await GetAllEvent(sort, year, name);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

const Get_Event = async (req, res) => {
  try {
    const { id_event } = req.params;
    const data = await GetSpesificEventById(id_event);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

const Add_Event = async (req, res) => {
  try {
    const data = req.body;
    const require = ["name_event", "price", "category", "year"];

    const check = validateRequestBody(data,require);
    // console.log(`checkvalid = ${check}`);

    if (check) {
      const add_data = await AddEventDB(data);
      console.log(add_data);
      if (add_data) {
        res.status(201).send({ msg: "Sucessfully added", data: add_data });
      }
    }else{
      res.status(500).send({ msg: "your data is not valid" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
};

const Update_Event = async (req, res) => {
  try {


    const data_update = req.body
    const data_id = req.params
    

    const data = {
      id_event: data_id.id_event || null,
      name_event: data_update.name_event || null,
      price: data_update.price || null,
      category: data_update.category || null,
      year: data_update.year || null
    };
  

    const hasil_update = await UpdateEventDB(data)
    if (hasil_update) {
      res.status(200).send({msg: "Update Success",data: hasil_update});

      
    }

  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: "internal server error" });

  }
};

module.exports = { Get_Events, Get_Event, Add_Event, Update_Event };
