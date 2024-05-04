const { AddBuyerDB } = require("../model/buyer");
const { GetSpesificEventById } = require("../model/event");
const { GetSpesificMerchandiseById } = require("../model/merchandise");

// const CheckMerchandise = async(req,res,next)=>{
//     try {
//         const {id_merchandise} = req.body
//         console.log(id_merchandise)

//         const data = await GetSpesificMerchandiseById(id_merchandise);
//         if (data.length > 0) {
//             req.data_merchandise = data[0]
//             next()
//           } else {
//             res.status(404).send({ msg: "data tidak ditemukan" });
//           }
//     } catch (error) {
//         res.status(500).send({ msg: "internal server error" });

        
//     }
// }

async function CheckMerchandise(req) {
  const {id_merchandise} = req.body
        console.log(id_merchandise)

        const data = await GetSpesificMerchandiseById(id_merchandise);
        if (data.length > 0) {
            return data[0]
            
          } else {
            throw new Error
          }
  
}


module.exports={CheckMerchandise}