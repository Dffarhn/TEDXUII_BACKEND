const { AddBuyerDB } = require("../model/buyer");
const { GetSpesificEventById } = require("../model/event");

async function CheckEvent(req) {
  const { id_event } = req.body;
  const data = await GetSpesificEventById(id_event);

  if (data.length > 0) {
    return data[0];
  } else {
    throw new Error();
  }
}

async function Add_Buyer(req) {
  const data = req.body;

  const add_to_db = await AddBuyerDB(data);

  if (add_to_db) {
    return add_to_db[0];
  } else {
    throw new Error();
  }
}

// const Add_Buyer = async(req, res,next) => {

//   try {
//     const data = req.body

//     const add_to_db = await AddBuyerDB(data)

//     if (add_to_db) {
//       req.data_buyer = add_to_db[0];
//       next()
//     }else{
//       res.status(500).send({ msg: "internal server error" });

//     }

//   } catch (error) {
//     res.status(500).send({ msg: "internal server error" });

//   }
// }

module.exports = { CheckEvent, Add_Buyer };
