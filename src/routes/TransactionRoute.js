const pool = require("../../db_connect.js");
const { validateRequestBody } = require("../function/Validator");
const { AddEventTransactionDB } = require("../model/transaction");
const { Midtrans_Payment } = require("./MidtransRoute.js");

const Add_Transaction = async(req,res)=>{
    try {
        const data = req.body;
        const data_event = req.data_event[0];
        const require = ["id_event", "id_buyer", "quantity"];

        const check = validateRequestBody(data, require);
        // console.log(`checkvalid = ${check}`);
    
        if (check) {
          const add_data = await AddEventTransactionDB(data,data_event);
          if (add_data) {
            const payment = await Midtrans_Payment(add_data)
            console.log(payment)
            if (payment) {
              res.status(201).send({ msg: "Sucessfully added", data: add_data ,payment: payment });
            }
          }
        } else {
          res.status(500).send({ msg: "your data is not valid" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "internal server error" });
      }


}

module.exports = {Add_Transaction};