const { Router } = require("express");
const { Midtrans_Payment } = require("./MidtransRoute.js");

const route = Router();




//Midtrans Payment routes
route.post("/payment", Midtrans_Payment);

module.exports = { route };
