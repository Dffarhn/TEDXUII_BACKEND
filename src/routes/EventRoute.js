const { GetAllEvent, GetSpesificEventById } = require("../model/event.js");

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
        const {id_event} = req.params
        const data = await GetSpesificEventById(id_event);
        res.status(200).send(data);
        
    } catch (error) {
        res.status(500).send({ msg: "internal server error" });
        
    }



}

module.exports = { Get_Events, Get_Event };
