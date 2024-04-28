const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = 10; // You can adjust the number of salt rounds as needed

const AccessApi = async (req, res, next) => {
  const token = req.headers.authorization;

  console.log(token)

  if (!token) {
    return res.status(403).send({ msg: 'Token missing' });
  }

  try {
    // Generate a unique salt for this hash
    console.log(process.env.HASHED_PASS_TOKEN)
    // Compare the hashed token with the hashed token from the environment variable
    const isMatch = await bcrypt.compare(token, process.env.HASHED_PASS_TOKEN);

    if (isMatch) {
      next(); // Move to the next middleware
    } else {
      res.status(403).send({ msg: 'Invalid token' });
    }
  } catch (err) {
    console.error('Token hashing error:', err);
    res.status(500).send({ msg: 'Internal server error' });
  }
};

module.exports = { AccessApi };
