const { AddBuyerDB } = require("../model/buyer");
const { GetSpesificEventById } = require("../model/event");


// const CheckEvent = async (req, res, next) => {
//   try {
//       const { id_event } = req.body;
//       const data = await GetSpesificEventById(id_event);

//       if (data.length > 0) {
//           req.data_event = data[0];
//           next();
//       } else {
//           // Release the lock and send response
//           res.status(404).send({ msg: "Data tidak ditemukan" });
//       }
//   } catch (error) {
//       // Release the lock and send response
//       console.error("Error in CheckEvent middleware:", error);
//       res.status(500).send({ msg: "Internal Server Error" });
//   }
// };

async function CheckEvent(req) {
    const { id_event } = req.body;
    const data = await GetSpesificEventById(id_event);

    if (data.length > 0) {
        return data[0]
    } else {
        throw new Error
    }  
}

async function Add_Buyer(req) {
    const data = req.body

    const add_to_db = await AddBuyerDB(data)

    if (add_to_db) {
      return add_to_db[0];

    }else{
      throw new Error

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

module.exports={CheckEvent,Add_Buyer}