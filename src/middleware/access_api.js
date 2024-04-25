const dotenv = require("dotenv");
dotenv.config();

const AccessApi = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === process.env.PASS_TOKEN) {
    // akan di buat menggunakan bycrpt
    next(); // Move to the next middleware
  } else {
    res.status(403).send({ msg: "You are not allowed" }); // Send 403 Forbidden status
  }
};

module.exports = { AccessApi };
