const pool = require("../../db_connect.js");
const { Mutex } = require("async-mutex");
const { validateRequestBody } = require("../function/Validator");
const { NotificationPayment, CancelPayment, Cek_Notification, ExpiredPayment } = require("../function/payment.js");
const { AddEventTransactionDB, UpdateEventTransactionDB } = require("../model/transaction");
const { AddbundlingTransactionDB } = require("../model/transactionBundling.js");
const { AddMerchandiseTransactionDB } = require("../model/transactionMerchandise.js");
const { Midtrans_Payment } = require("./MidtransRoute.js");

const mutex = new Mutex();

const Add_Transaction_Bundling = async (req, res) => {
  try {
    const data = req.body;
    const data_Bundling = req.data_Bundling;
    const data_buyer = req.data_buyer;

    const require = ["id_bundling", "username", "email", "phone_number", "address", "quantity"];

    const check = validateRequestBody(data, require);
    // console.log(`checkvalid = ${check}`);

    if (check) {
      const release = await mutex.acquire();

      try {
        await pool.query("BEGIN");
        const add_data = await AddbundlingTransactionDB(data, data_Bundling, data_buyer);
        add_data[0].category = "bundling";
        if (add_data) {
          const payment = await Midtrans_Payment(add_data);
          console.log(payment);
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

module.exports = { Add_Transaction_Bundling };
