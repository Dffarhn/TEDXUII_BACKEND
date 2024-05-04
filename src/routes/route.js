const { Router } = require("express");
const { Midtrans_Payment } = require("./MidtransRoute.js");
const { Get_Events, Get_Event, Add_Event, Update_Event, Delete_Event } = require("./EventRoute.js");
const { Get_Merchandises, Get_Merchandise, Add_Merchandise, Update_Merchandise, Delete_Merchandise } = require("./MerchandiseRoute.js");
const { Get_Bundlings, Get_Bundling, Add_Bundling, Update_Bundling, Delete_Bundling } = require("./BundlingRoute.js");
const { Add_Transaction_Event, Notification_Transaction_Event, Cancel_Transaction_Event, Expired_Transaction_Event } = require("./TransactionRoute.js");
const { CheckEvent, Add_Buyer } = require("../middleware/transactionMid.js");
const { CheckMerchandise } = require("../middleware/transactionMidMerchandise.js");
const { Add_Transaction_merchandise } = require("./TransactionMerchandiseRoute.js");
const { CheckBundling } = require("../middleware/transactionMidBundling.js");
const { Add_Transaction_Bundling } = require("./TransactionBundlingRoute.js");
const { register, login } = require("./AdminRoute.js");
const { merchandiseUpload, convertToWebP, eventsUpload } = require("../middleware/multerHandle.js");
const { Auth_Access } = require("../middleware/jwtToken.js");

const route = Router();

route.get("/", (req, res) => {
  res.status(200).send("Halo world");
});



//admin
route.post("/login", login);

route.post("/register", register)

route.get("/testauth", Auth_Access, async (req, res) => {
  try {
    if (req.newAccessToken) {
      // If a new access token was generated during token refresh
      // You can send it back to the client in the response headers or body
      res.setHeader("Authorization", `Bearer ${req.newAccessToken}`);
      // or res.json({ newAccessToken: req.newAccessToken, message: "bisa" });
    }
    
    console.log(req.user);
    res.status(200).send("bisa");
  } catch (error) {
    res.status(500).send("u cant access");
  }
});






//route transaction bundling
route.post("/transaction/bundling",Add_Buyer,CheckBundling, Add_Transaction_Bundling);

//route transaction merchandise
route.post("/transaction/merchandise",Add_Buyer,CheckMerchandise, Add_Transaction_merchandise);

//route transaction event
// route.post("/transaction/event",Add_Buyer,CheckEvent, Add_Transaction_Event);

const { Mutex } = require('async-mutex');

// Create a mutex to control access
const mutex = new Mutex();

// Handler for route /transaction/event
route.post("/transaction/event", async (req, res, next) => {
    try {
        // Acquire lock before executing synchronized code
        const release = await mutex.acquire();

        try {
            // Chain the middleware functions using promises for sequential execution
            await Add_Buyer(req, res, next);
            await CheckEvent(req, res, next);
            await Add_Transaction_Event(req, res);
        } catch (error) {
            // Handle errors in sequential execution
            console.error("Error processing transaction:", error);
            res.status(500).send({ msg: "Internal server error" });
        } finally {
            // Release lock after synchronized execution
            release();
        }
    } catch (error) {
        // Handle errors in lock acquisition
        console.error("Error acquiring lock:", error);
        res.status(500).send({ msg: "Internal server error" });
    }
});



route.post("/transaction/notif",Notification_Transaction_Event)

route.post("/transaction/cancel/v1",Cancel_Transaction_Event)
route.post("/transaction/cancel/v2",Expired_Transaction_Event)






//route Bundling
route.get("/bundlings", Get_Bundlings)
route.get("/bundling/:id_bundling", Get_Bundling)
route.post("/bundling",Auth_Access ,Add_Bundling);
route.patch("/bundling/:id_bundling", Auth_Access,Update_Bundling );
route.delete("/bundling/:id_bundling", Auth_Access,Delete_Bundling);


//route Merchandise
route.get("/merchandises", Get_Merchandises);
route.get("/merchandise/:id_merchandise", Get_Merchandise);
route.post("/merchandise", Auth_Access,merchandiseUpload.single('image_merchandise'),convertToWebP,Add_Merchandise);
route.patch("/merchandise/:id_merchandise",Auth_Access,merchandiseUpload.single('image_merchandise'),convertToWebP, Update_Merchandise);
route.delete("/merchandise/:id_merchandise",Auth_Access, Delete_Merchandise);

// Route events
route.get("/events", Get_Events);
route.get("/event/:id_event", Get_Event);
route.post("/event",Auth_Access,eventsUpload.single('image_event') ,convertToWebP,Add_Event);
route.patch("/event/:id_event",Auth_Access,eventsUpload.single('image_event') ,convertToWebP, Update_Event);
route.delete("/event/:id_event",Auth_Access, Delete_Event);

//Midtrans Payment routes
route.post("/payment", Midtrans_Payment);

module.exports = { route };
