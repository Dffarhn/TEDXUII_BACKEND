const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieparser = require("cookie-parser");

const { route } = require("./src/routes/route.js");
const { AccessApi } = require("./src/middleware/access_api.js");

const pool = require("./db_connect.js");
const dotenv = require("dotenv");
const { Notification_Transaction } = require("./src/routes/TransactionRoute.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
app.use(helmet());
app.use(cookieparser());
const corsOptions = {
  origin: "http://127.0.0.1:3000", // Replace 'https://example.com' with your specific URL
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified HTTP methods
};
//midtrans only
app.post("/transaction/notif", Notification_Transaction);
app.use(cors(corsOptions));
app.use(express.json());

app.use(AccessApi);

app.use(route);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
