const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieparser = require("cookie-parser");

const { route } = require("./src/routes/route.js");

const dotenv = require("dotenv");
const { Notification_Transaction, Cancel_Transaction_Event } = require("./src/routes/TransactionRoute.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
app.use(cookieparser());
app.use(helmet());
const corsOptions = {
  origin: "*", // Replace with your specific URLs
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"], // Allow specified HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "access_api"], // Specify allowed request headers
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
