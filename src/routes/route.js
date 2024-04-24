const { Router } = require("express");
const { Midtrans_Payment } = require("./MidtransRoute.js");

const route = Router();


route.get('/',(req,res)=>{
  res.status(200).send("Halo world");
})

//Midtrans Payment routes
route.post("/payment", Midtrans_Payment);

module.exports = { route };
