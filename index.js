const express = require("express");
const cors = require("cors");

const { route } = require("./src/routes/route.js");
const { AccessApi } = require("./src/middleware/access_api.js");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Replace 'https://example.com' with your specific URL
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(AccessApi);

app.use(route);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
