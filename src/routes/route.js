const { Router } = require("express");
const { Midtrans_Payment } = require("./MidtransRoute.js");
const { Get_Events, Get_Event, Add_Event, Update_Event } = require("./EventRoute.js");

const route = Router();


route.get('/',(req,res)=>{
  res.status(200).send("Halo world");
})


route.get('/events',Get_Events)
route.get('/event/:id_event',Get_Event)
route.post('/event',Add_Event)
route.patch('/event/:id_event', Update_Event)

//Midtrans Payment routes
route.post("/payment", Midtrans_Payment);

module.exports = { route };
