const pool = require("../../db_connect.js");
const { Mutex } = require("async-mutex");
const { validateRequestBody } = require("../function/Validator");
const { AddMerchandiseTransactionDB } = require("../model/transactionMerchandise.js");
const { Midtrans_Payment } = require("./MidtransRoute.js");
const { CheckMerchandise } = require("../middleware/transactionMidMerchandise.js");
const { Add_Buyer } = require("../middleware/transactionMid.js");
const { flushKeysStartingWith } = require("../function/redisflushupdate.js");
const mutex = new Mutex();

const Add_Transaction_merchandise = async (req, res) => {
  const release = await mutex.acquire();
  try {
    const data = req.body;

    const data_merchandise = await CheckMerchandise(req);
    const data_buyer = await Add_Buyer(req);

    const require = ["id_merchandise", "username", "email", "phone_number", "address", "quantity"];

    const check = validateRequestBody(data, require);
    // console.log(`checkvalid = ${check}`);

    if (check) {
      await pool.query("BEGIN");
      const add_data = await AddMerchandiseTransactionDB(data, data_merchandise, data_buyer);
      add_data[0].category = "merchandise";
      if (add_data) {
        const payment = await Midtrans_Payment(add_data);
        console.log(payment);
        if (payment) {
          await pool.query("COMMIT");
          await flushKeysStartingWith("merchandise");
          res.status(201).send({ msg: "Sucessfully added", data: add_data, payment: payment });
        }
      }

      // Acquire the mutex lock
    } else {
      await pool.query("ROLLBACK");
      res.status(500).send({ msg: "your data is not valid" });
    }
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    res.status(500).send({ msg: "internal server error" });
  } finally {
    release();
  }
};

module.exports = { Add_Transaction_merchandise };
