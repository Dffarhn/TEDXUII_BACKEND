const { Router } = require("express");
const { Midtrans_Payment } = require("./MidtransRoute.js");
const { Get_Events, Get_Event, Add_Event, Update_Event, Delete_Event } = require("./EventRoute.js");
const { Get_Merchandises, Get_Merchandise, Add_Merchandise, Update_Merchandise, Delete_Merchandise } = require("./MerchandiseRoute.js");

const route = Router();

route.get("/", (req, res) => {
  res.status(200).send("Halo world");
});

//route Merchandise
route.get("/merchandises", Get_Merchandises);
route.get("/merchandise/:id_merchandise", Get_Merchandise);
route.post("/merchandise", Add_Merchandise);
route.patch("/merchandise/:id_merchandise", Update_Merchandise);
route.delete("/merchandise/:id_merchandise", Delete_Merchandise);

// Route events
route.get("/events", Get_Events);
route.get("/event/:id_event", Get_Event);
route.post("/event", Add_Event);
route.patch("/event/:id_event", Update_Event);
route.delete("/event/:id_event", Delete_Event);

//Midtrans Payment routes
route.post("/payment", Midtrans_Payment);

module.exports = { route };
