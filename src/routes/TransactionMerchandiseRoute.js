const pool = require("../../db_connect.js");
const { validateRequestBody } = require("../function/Validator");
const { NotificationPayment, CancelPayment, Cek_Notification, ExpiredPayment } = require("../function/payment.js");
const { AddEventTransactionDB, UpdateEventTransactionDB } = require("../model/transaction");
const { AddMerchandiseTransactionDB } = require("../model/transactionMerchandise.js");
const { Midtrans_Payment } = require("./MidtransRoute.js");

const Add_Transaction_merchandise = async(req,res)=>{
    try {
        const data = req.body;
        const data_merchandise = req.data_merchandise;
        const data_buyer = req.data_buyer;

        const require = ["id_merchandise", "username","email","phone_number","address","quantity"];

        const check = validateRequestBody(data, require);
        // console.log(`checkvalid = ${check}`);
    
        if (check) {
          await pool.query("BEGIN")
          const add_data = await AddMerchandiseTransactionDB(data,data_merchandise,data_buyer);
          if (add_data) {
            const payment = await Midtrans_Payment(add_data)
            console.log(payment)
            if (payment) {
              await pool.query("COMMIT")
              res.status(201).send({ msg: "Sucessfully added", data: add_data ,payment: payment });
            }
          }
        } else {
          await pool.query("ROLLBACK")
          res.status(500).send({ msg: "your data is not valid" });
        }
      } catch (error) {
        await pool.query("ROLLBACK")
        console.log(error);
        res.status(500).send({ msg: "internal server error" });
      }


}


const Notification_Transaction_merchandise = async (req, res) => {

  try {
    const receivedJson = req.body
    console.log(receivedJson);
    const info_payment = await NotificationPayment(receivedJson)

    if (info_payment) {
      const update_event_transaction = Cek_Notification(info_payment)

      if (update_event_transaction !== "pending" || update_event_transaction !== "unknown") {
        const update_transaction_merchandise_toDB = UpdateEventTransactionDB(parseInt(info_payment.order_id,10), update_event_transaction)  
        console.log(update_transaction_merchandise_toDB);      
      }
      
    }

  } catch (error) {
    console.error(error);
    
  }
}


const Cancel_Transaction_merchandise = async (req,res) => {
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
const Expired_Transaction_merchandise = async (req,res) => {
  try {
    const data = req.body

    const cancel_payment = await ExpiredPayment(data)
    console.log(cancel_payment)
    if (cancel_payment.status_code === '407') {
      res.status(200).send({ message:"sucessful delete transaction", data : cancel_payment})
    }
    
  } catch (error) {
    res.status(500).send({ message:"internal server error"})
    
  }
}

module.exports = {Add_Transaction_merchandise, Notification_Transaction_merchandise,Cancel_Transaction_merchandise,Expired_Transaction_merchandise};