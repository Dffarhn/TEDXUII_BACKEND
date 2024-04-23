const { Router } = require("express");

const route = Router();

route.get("/", (req, res) => {
  console.log(process.env.PORT);
  res.send("halo world routes");
});

module.exports = { route };
