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
  jwt.verify(token, process.env.SECRET_KEY_TOKEN, async (err, decoded) => {
    if (err) {
      try {
        const accessToken = await Auth_refresh_check(req);
        req.newAccessToken = accessToken;
        next();
      } catch (error) {
        return res.status(403).json({ message: `Refresh token is invalid.`, FE: "redirect to login" });
      }
    } else {
      // Token is valid, attach decoded user information to the request object
      req.user = decoded;
      next(); // Proceed to the next middleware or route handler
    }
  });
};

async function Auth_refresh_check(req) {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      throw new Error("Refresh token is missing.");
    }

    // Verify the refresh token
    const decoded = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    console.log(decoded);

    const payload = { id: decoded.id, username: decoded.username, email: req.body.email };

    // Refresh token is valid, generate a new access token
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
      expiresIn: "10m",
    });

    console.log(accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error in Auth_refresh_check:", error);
    throw new Error("Refresh token verification failed.");
  }
}

module.exports = { Auth_Access };
