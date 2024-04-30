const { GetSpesificEventById } = require("../model/event");

const CheckEvent = async(req,res,next)=>{
    try {
        const {id_event} = req.body

        const data = await GetSpesificEventById(id_event);
        if (data.length > 0) {
            req.data_event = data
            next()
          } else {
            res.status(404).send({ msg: "data tidak ditemukan" });
          }
    } catch (error) {
        res.status(500).send({ msg: "internal server error" });

        
    }
}

module.exports={CheckEvent}