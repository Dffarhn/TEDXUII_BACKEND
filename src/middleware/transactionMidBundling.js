const { GetSpesificBundlingById } = require("../model/bundling");
const { AddBuyerDB } = require("../model/buyer");
const { GetSpesificEventById } = require("../model/event");
const { GetSpesificMerchandiseById } = require("../model/merchandise");

const CheckBundling = async(req,res,next)=>{
    try {
        const {id_bundling} = req.body
        console.log(id_bundling)

        const data = await GetSpesificBundlingById(id_bundling);
        if (data.length > 0) {
            req.data_Bundling = data[0]
            next()
          } else {
            res.status(404).send({ msg: "data tidak ditemukan" });
          }
    } catch (error) {
        res.status(500).send({ msg: "internal server error" });

        
    }
}


module.exports={CheckBundling}