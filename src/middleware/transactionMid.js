const { AddBuyerDB } = require("../model/buyer");
const { GetSpesificEventById } = require("../model/event");

const { Mutex } = require('async-mutex');
const mutex = new Mutex();

const CheckEvent = async (req, res, next) => {
    try {
        // Acquire the mutex lock
        const release = await mutex.acquire();

        const { id_event } = req.body;
        const data = await GetSpesificEventById(id_event);

        if (data.length > 0) {
            req.data_event = data[0];
            // Release the mutex lock before calling next()
            release();
            next();
        } else {
            // Release the mutex lock before sending the response
            release();
            res.status(404).send({ msg: "Data tidak ditemukan" });
        }
    } catch (error) {
        // Release the mutex lock before sending the response
        release();
        console.error("Error in CheckEvent middleware:", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const Add_Buyer = async(req, res,next) => {

  try {
    const data = req.body

    const add_to_db = await AddBuyerDB(data)

    if (add_to_db) {
      req.data_buyer = add_to_db[0];
      next()
    }else{
      res.status(500).send({ msg: "internal server error" });

    }


    
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
    
  }
}

module.exports={CheckEvent,Add_Buyer}