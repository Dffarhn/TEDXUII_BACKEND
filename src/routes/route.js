const { Router } = require("express");
const { Midtrans_Payment } = require("./MidtransRoute.js");
const { Get_Events, Get_Event, Add_Event, Update_Event, Delete_Event } = require("./EventRoute.js");
const { Get_Merchandises, Get_Merchandise, Add_Merchandise, Update_Merchandise, Delete_Merchandise } = require("./MerchandiseRoute.js");
const { Get_Bundlings, Get_Bundling, Add_Bundling, Update_Bundling, Delete_Bundling } = require("./BundlingRoute.js");
const { Add_Transaction } = require("./TransactionRoute.js");
const { CheckEvent, Add_Buyer } = require("../middleware/transactionMid.js");

const route = Router();

route.get("/", (req, res) => {
  res.status(200).send("Halo world");
});



//admin


//route transaction bundling

//route transaction merchandise

//route transaction event
route.post("/transaction/event",Add_Buyer,CheckEvent, Add_Transaction);






//route Bundling
route.get("/bundlings", Get_Bundlings)
route.get("/bundling/:id_bundling", Get_Bundling)
route.post("/bundling", Add_Bundling);
route.patch("/bundling/:id_bundling", Update_Bundling );
route.delete("/bundling/:id_bundling", Delete_Bundling);


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
