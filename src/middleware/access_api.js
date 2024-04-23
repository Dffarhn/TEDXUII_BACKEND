const AccessApi = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === "admin") {
    // akan di buat menggunakan bycrpt
    next(); // Move to the next middleware
  } else {
    console.log(process.env.PASS_TOKEN);
    res.status(403).send({ msg: "You are not allowed" }); // Send 403 Forbidden status
  }
};

module.exports = { AccessApi };
