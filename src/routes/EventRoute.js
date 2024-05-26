const { client } = require("../../redis_connect.js");
const { validateRequestBody, validatorUUID } = require("../function/Validator.js");
const { flushKeysStartingWith } = require("../function/redisflushupdate.js");
const { GetAllEvent, GetSpesificEventById, AddEventDB, UpdateEventDB, DeleteEventDB } = require("../model/event.js");

const Get_Events = async (req, res) => {
  const { sort, year, name } = req.query;

  // Create cache key based on query parameters
  const cacheKey = `events_${sort || "default"}_${year || "default"}_${name || "default"}`;
  try {
    const data_event = await GetAllEvent(sort, year, name);

    if (data_event.length > 0) {
      await client.setEx(cacheKey, 3600, JSON.stringify(data_event));
      res.status(200).send({msg: "data ditemukan",data:data_event});
    } else {
      res.status(200).send({ msg: "data tidak ditemukan" });
    }
  } catch (error) {
 res.status(500).send({ msg: error.message });
  }
};

const Get_Event = async (req, res) => {
  try {
    const { id_event } = req.params;
    const data_event = await GetSpesificEventById(id_event);

    if (data_event.length > 0) {
      res.status(200).send({msg: "data ditemukan",data:data_event});
    } else {
      res.status(200).send({ msg: "data tidak ditemukan" });
    }
  } catch (error) {
 res.status(500).send({ msg: error.message });
  }
};

const Add_Event = async (req, res) => {
  try {
    const data = req.body;
    const require = ["name", "price", "category", "year", "venue", "held_at", "early_bid","deskripsi","time_start","time_end"];

    const check = validateRequestBody(data, require);
    // console.log(`checkvalid = ${check}`);

    if (check) {
      console.log(`checkvalid =masok`);
      data.image_file = req.image;
      const add_data = await AddEventDB(data);
      console.log(add_data);
      if (add_data) {
        await flushKeysStartingWith("event");
        res.status(201).send({ msg: "Sucessfully added", data: add_data });
      }
    } else {
      res.status(500).send({ msg: "your data is not valid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.message });
  }
};

const Update_Event = async (req, res) => {
  try {
    const data_update = req.body;
    const data_id = req.params;
    data_update.image_file = req.image;

    if (!validatorUUID(data_id.id_event)) {
      throw new Error();
    }
    const data = {
      id_event: data_id.id_event || null,
      name: data_update.name || null,
      price: data_update.price || null,
      category: data_update.category || null,
      year: data_update.year || null,
      stock: data_update.stock || null,
      venue: data_update.venue || null,
      held_at: data_update.held_at || null,
      image: data_update.image_file || null,
      early_bid: data_update.early_bid || null,
      deskripsi: data_update.deskripsi || null,
      time_start: data_update.time_start || null,
      time_end: data_update.time_end || null
    };
    const filteredData = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null));

    const hasil_update = await UpdateEventDB(filteredData);
    if (hasil_update) {
      await flushKeysStartingWith("event");
      res.status(200).send({ msg: "Update Success", data: hasil_update });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error.message });
  }
};

const Delete_Event = async (req, res) => {
  try {
    const { id_event } = req.params;
    if (validatorUUID(id_event)) {
      const hasil_delete = await DeleteEventDB(id_event);

      if (hasil_delete) {
        await flushKeysStartingWith("event");
        res.status(200).send({ msg: "delete event successfully deleted" });
      }
    } else {
      res.status(500).send({ msg: "invalid type input uuid" });
    }
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = { Get_Events, Get_Event, Add_Event, Update_Event, Delete_Event };
