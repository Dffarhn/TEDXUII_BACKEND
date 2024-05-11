const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const Auth_Access = (req, res, next) => {
  // Get the access token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token part

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: "Access token is missing." });
  }

  // Verify the access token
  jwt.verify(token, process.env.SECRET_KEY_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Access token is invalid." });
    }
    // Token is valid, attach decoded user information to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};

const Refresh_Access_Token = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing." });
    }

    // Verify the refresh token
    const decoded = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    // console.log(decoded);

    const payload = { id: decoded.id, username: decoded.username, email: decoded.email };
    console.log(payload)

    // Generate a new access token
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "10m",
    });

    console.log(accessToken);
    return res.status(200).send({ msg: "refresh successful", token:accessToken });
  } catch (error) {
    console.error("Error in Refresh_Access_Token:", error);
    return res.status(403).json({ message: "Refresh token verification failed." });
  }
};

module.exports = { Auth_Access, Refresh_Access_Token };
