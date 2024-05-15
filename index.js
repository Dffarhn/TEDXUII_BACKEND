const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieparser = require("cookie-parser");

const { route } = require("./src/routes/route.js");

const pool = require("./db_connect.js");
const dotenv = require("dotenv");
const { Notification_Transaction, Cancel_Transaction_Event } = require("./src/routes/TransactionRoute.js");
const { AccessApi } = require("./src/middleware/access_api.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
app.use(helmet());
app.use(cookieparser());
const corsOptions = {
  origin: "*", // Replace 'https://example.com' with your specific URL
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified HTTP methods
};
//midtrans only


app.use(cors(corsOptions));
app.use(express.json());
app.get("/transaction/cancel/v1", Cancel_Transaction_Event);
app.post("/transaction/notif", Notification_Transaction);
app.get("/", (req, res) => {
  // res.status(200).send("Halo world");
  res.redirect("https://tedxwebsite-umber.vercel.app/")
});

// app.use(AccessApi);

app.use(route);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
