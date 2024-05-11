const { Router } = require("express");
const { Midtrans_Payment } = require("./MidtransRoute.js");
const { Get_Events, Get_Event, Add_Event, Update_Event, Delete_Event } = require("./EventRoute.js");
const { Get_Merchandises, Get_Merchandise, Add_Merchandise, Update_Merchandise, Delete_Merchandise } = require("./MerchandiseRoute.js");
const { Get_Bundlings, Get_Bundling, Add_Bundling, Update_Bundling, Delete_Bundling } = require("./BundlingRoute.js");
const { Add_Transaction_Event, Notification_Transaction, Cancel_Transaction_Event, Expired_Transaction_Event } = require("./TransactionRoute.js");
const { CheckEvent, Add_Buyer } = require("../middleware/transactionMid.js");
const { CheckMerchandise } = require("../middleware/transactionMidMerchandise.js");
const { Add_Transaction_merchandise } = require("./TransactionMerchandiseRoute.js");
const { CheckBundling } = require("../middleware/transactionMidBundling.js");
const { Add_Transaction_Bundling } = require("./TransactionBundlingRoute.js");
const { register, login, GetAllTransactionBundlingRoute, GetAllTransactionEventsRoute, GetAllTransactionMerchandiseRoute, GetAllTransactionCounts } = require("./AdminRoute.js");
const { merchandiseUpload, convertToWebP, eventsUpload } = require("../middleware/multerHandle.js");
const { Auth_Access, Refresh_Access_Token } = require("../middleware/jwtToken.js");
const { redisCacheMiddleware_Bundling, redisCacheMiddleware_Merchandises, redisCacheMiddleware_Events } = require("../middleware/Redis_Middleware.js");
const { GetAllTransactionbundling, GetAllTransactionMerchandise, GetAllTransactionEvents, CountTransactionSuccess } = require("../model/admin.js");

const route = Router();

route.get("/", (req, res) => {
  res.status(200).send("Halo world");
});

//admin
route.post("/login", login);
route.post("/register", register);

route.get('/refreshtoken', Refresh_Access_Token)

//route transaction bundling
route.post("/transaction/bundling", Add_Transaction_Bundling);
route.get("/transaction/bundling",Auth_Access,GetAllTransactionBundlingRoute)

//route transaction merchandise
route.post("/transaction/merchandise", Add_Transaction_merchandise);
route.get("/transaction/merchandise",Auth_Access,GetAllTransactionMerchandiseRoute)

//route transaction event
route.post("/transaction/event", Add_Transaction_Event);
route.get("/transaction/event",Auth_Access,GetAllTransactionEventsRoute)


route.get("/transaction/count",GetAllTransactionCounts)

// route.post("/transaction/notif", Notification_Transaction);

route.post("/transaction/cancel/v1", Cancel_Transaction_Event);
route.post("/transaction/cancel/v2", Expired_Transaction_Event);

//route Bundling
route.get("/bundlings", redisCacheMiddleware_Bundling, Get_Bundlings);
route.get("/bundling/:id_bundling", Get_Bundling);
route.post("/bundling", Auth_Access, Add_Bundling);
route.patch("/bundling/:id_bundling", Auth_Access, Update_Bundling);
route.delete("/bundling/:id_bundling", Auth_Access, Delete_Bundling);

//route Merchandise
route.get("/merchandises", redisCacheMiddleware_Merchandises, Get_Merchandises);
route.get("/merchandise/:id_merchandise", Get_Merchandise);
route.post("/merchandise", Auth_Access, merchandiseUpload.single("merchandiseFile"), convertToWebP, Add_Merchandise);
route.patch("/merchandise/:id_merchandise", Auth_Access, merchandiseUpload.single("merchandiseFile"), convertToWebP, Update_Merchandise);
route.delete("/merchandise/:id_merchandise", Auth_Access, Delete_Merchandise);

// Route events
route.get("/events", redisCacheMiddleware_Events, Get_Events);
route.get("/event/:id_event", Get_Event);
route.post("/event", Auth_Access, eventsUpload.single("eventFile"), convertToWebP, Add_Event);
route.patch("/event/:id_event", Auth_Access, eventsUpload.single("eventFile"), convertToWebP, Update_Event);
route.delete("/event/:id_event", Auth_Access, Delete_Event);

//Midtrans Payment routes
route.post("/payment", Midtrans_Payment);

module.exports = { route };
