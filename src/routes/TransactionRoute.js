const pool = require("../../db_connect.js");
const { validateRequestBody } = require("../function/Validator");
const { NotificationPayment, CancelPayment, Cek_Notification, ExpiredPayment } = require("../function/payment.js");
const { flushKeysStartingWith } = require("../function/redisflushupdate.js");
const { CheckEvent, Add_Buyer } = require("../middleware/transactionMid.js");
const { AddEventTransactionDB, UpdateEventTransactionDB } = require("../model/transaction");
const { UpdatebundlingTransactionDB } = require("../model/transactionBundling.js");
const { UpdateMerchandiseTransactionDB } = require("../model/transactionMerchandise.js");
const { Midtrans_Payment } = require("./MidtransRoute.js");
const { Mutex } = require("async-mutex");

const mutex = new Mutex();
const Add_Transaction_Event = async (req, res) => {
  const release = await mutex.acquire();

  try {
    const data = req.body;

    const data_event = await CheckEvent(req);
    const data_buyer = await Add_Buyer(req);

    const require = ["id_event", "username", "email", "phone_number", "address", "quantity"];

    const check = validateRequestBody(data, require);

    if (check) {
      await pool.query("BEGIN");
      const add_data = await AddEventTransactionDB(data, data_event, data_buyer);
      add_data[0].category = "event";
      if (add_data) {
        const payment = await Midtrans_Payment(add_data);
        if (payment) {
          await pool.query("COMMIT");
          await flushKeysStartingWith("event");
          res.status(201).send({ msg: "Successfully added", data: add_data, payment: payment });
        }
      }
    } else {
      await pool.query("ROLLBACK");
      res.status(500).send({ msg: "Your data is not valid" });
    }
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  } finally {
    release();
  }
};

const mutex_midtrans = new Mutex();
const Notification_Transaction = async (req, res) => {
  const release_midtrans = await mutex_midtrans.acquire();
  try {
    const receivedJson = req.body;
    // console.log("masuk");
    const info_payment = await NotificationPayment(receivedJson);

    if (info_payment) {
      const update_transaction = Cek_Notification(info_payment);
      console.log("in update transaction")

      if (update_transaction !== "pending" && update_transaction !== "unknown") {
        if (info_payment.custom_field1 === "event") {
          const update_transaction_event_toDB = await UpdateEventTransactionDB(info_payment.order_id, update_transaction);
          console.log(update_transaction_event_toDB);
          res.status(200).send("Thank you for your Midtrans");
        } else if (info_payment.custom_field1 === "merchandise") {
          const update_transaction_Merchandise_toDB = await UpdateMerchandiseTransactionDB(info_payment.order_id, update_transaction);
          console.log(update_transaction_Merchandise_toDB);
          res.status(200).send("Thank you for your Midtrans");
        } else if (info_payment.custom_field1 === "bundling") {
          const update_transaction_bundling_toDB = await UpdatebundlingTransactionDB(info_payment.order_id, update_transaction);
          console.log(update_transaction_bundling_toDB);
          res.status(200).send("Thank you for your Midtrans");
        }
      } else {
        res.status(200).send("Thank you for your Midtrans");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Thank you for your Midtrans");
  } finally {
    release_midtrans();
  }
};

const Cancel_Transaction_Event = async (req, res) => {
  try {
    // const data = req.body;
    const {order_id,transaction_status} = req.query
    
    
    if (transaction_status === "pending") {
      console.log("EVENT UNFINISH LINK")
      
      const cancel_payment = await CancelPayment(order_id);

      if (cancel_payment.status_code === "200") {
        res.redirect("https://tedxwebsite-umber.vercel.app/")
      }
    }else{
      console.log("EVENT FINISH LINK")
      res.redirect("https://tedxwebsite-umber.vercel.app/")

    }

  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
};
const Expired_Transaction_Event = async (req, res) => {
  try {
    const data = req.body;

    const cancel_payment = await ExpiredPayment(data);
    console.log(cancel_payment);
    if (cancel_payment.status_code === "407") {
      res.status(200).send({ message: "sucessful delete transaction", data: cancel_payment });
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
};

module.exports = { Add_Transaction_Event, Notification_Transaction, Cancel_Transaction_Event, Expired_Transaction_Event };
