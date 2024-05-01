const { validateRequestBody } = require("../function/Validator");
const { NotificationPayment, CancelPayment } = require("../function/payment.js");
const { AddEventTransactionDB } = require("../model/transaction");
const { Midtrans_Payment } = require("./MidtransRoute.js");

const Add_Transaction_Event = async(req,res)=>{
    try {
        const data = req.body;
        const data_event = req.data_event;
        const data_buyer = req.data_buyer;

        const require = ["id_event", "username","email","phone_number","address","quantity"];

        const check = validateRequestBody(data, require);
        // console.log(`checkvalid = ${check}`);
    
        if (check) {
          const add_data = await AddEventTransactionDB(data,data_event,data_buyer);
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


const Notification_Transaction_Event = (req, res) => {

  try {
    const receivedJson = req.body
    console.log(receivedJson);
    const info_payment = NotificationPayment(receivedJson)
    console.log(info_payment);

  } catch (error) {
    
  }
}


const Cancel_Transaction_Event = async (req,res) => {
  try {
    const data = req.body

    const cancel_payment = await CancelPayment(data)
    if (cancel_payment.status_code === '200') {
      res.status(200).send({ message:"sucessful delete transaction", data : cancel_payment})
    }
    
  } catch (error) {
    res.status(500).send({ message:"internal server error"})
    
  }
}

module.exports = {Add_Transaction_Event, Notification_Transaction_Event,Cancel_Transaction_Event};