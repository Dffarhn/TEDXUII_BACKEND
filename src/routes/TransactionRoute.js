const pool = require("../../db_connect.js");
const { Mutex } = require("async-mutex");
const { validateRequestBody } = require("../function/Validator");
const { NotificationPayment, CancelPayment, Cek_Notification, ExpiredPayment } = require("../function/payment.js");
const { AddEventTransactionDB, UpdateEventTransactionDB } = require("../model/transaction");
const { UpdatebundlingTransactionDB } = require("../model/transactionBundling.js");
const { UpdateMerchandiseTransactionDB } = require("../model/transactionMerchandise.js");
const { Midtrans_Payment } = require("./MidtransRoute.js");

const mutex = new Mutex();

const Add_Transaction_Event = async (req, res) => {
  try {
    const data = req.body;
    const data_event = req.data_event;
    const data_buyer = req.data_buyer;

    const require = ["id_event", "username", "email", "phone_number", "address", "quantity"];

    const check = validateRequestBody(data, require);
    // console.log(`checkvalid = ${check}`);

    if (check) {
      const release = await mutex.acquire();

      try {
        await pool.query("BEGIN");
        const add_data = await AddEventTransactionDB(data, data_event, data_buyer);
        add_data[0].category = "event";
        if (add_data) {
          const payment = await Midtrans_Payment(add_data);
          if (payment) {
            await pool.query("COMMIT");
            res.status(201).send({ msg: "Sucessfully added", data: add_data, payment: payment });
          }
        }
      } finally {
        release();
      }
    } else {
      await pool.query("ROLLBACK");
      res.status(500).send({ msg: "your data is not valid" });
    }
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  }
};

const Notification_Transaction_Event = async (req, res) => {
  try {
    const receivedJson = req.body;
    console.log(receivedJson);
    const info_payment = await NotificationPayment(receivedJson);

    if (info_payment) {
      const update_transaction = Cek_Notification(info_payment);

      if (update_transaction !== "pending" || update_transaction !== "unknown") {
        if (info_payment.custom_field1 === "event") {
          const update_transaction_event_toDB = UpdateEventTransactionDB(info_payment.order_id, update_transaction);
          console.log(update_transaction_event_toDB);
        } else if (info_payment.custom_field1 === "merchandise") {
          const update_transaction_Merchandise_toDB = UpdateMerchandiseTransactionDB(info_payment.order_id, update_transaction);
          console.log(update_transaction_Merchandise_toDB);
        } else if (info_payment.custom_field1 === "bundling") {
          const update_transaction_bundling_toDB = UpdatebundlingTransactionDB(info_payment.order_id, update_transaction);
          console.log(update_transaction_bundling_toDB);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const Cancel_Transaction_Event = async (req, res) => {
  try {
    const data = req.body;

    const cancel_payment = await CancelPayment(data);
    if (cancel_payment.status_code === "200") {
      res.status(200).send({ message: "sucessful delete transaction", data: cancel_payment });
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

module.exports = { Add_Transaction_Event, Notification_Transaction_Event, Cancel_Transaction_Event, Expired_Transaction_Event };
