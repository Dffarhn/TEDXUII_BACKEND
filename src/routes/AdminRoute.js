const jwt = require("jsonwebtoken");
const { Add_AdminDB, check_LoginDB, GetAllTransactionbundling, GetAllTransactionEvents, CountTransactionSuccess, GetAllTransactionMerchandise } = require("../model/admin");
const dotenv = require("dotenv");
const { validateRequestBody } = require("../function/Validator");
dotenv.config();

const register = async (req, res) => {
  try {
    const data = req.body;
    const require = ["username", "email", "password"];

    const check = validateRequestBody(data, require);

    if (check) {
      const add_admin = await Add_AdminDB(data);
      if (add_admin) {
        const payload = { id: add_admin.id, username: add_admin.username, email: add_admin.email };
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
          expiresIn: "10m",
        });
        // Creating refresh token not that expiry of refresh
        //token is greater than the access token

        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
          expiresIn: "1d",
        });

        // Assigning refresh token in http-only cookie
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        data.accessToken = accessToken;

        res.status(200).send({ msg: "register successfully", data: data });
      } else {
        res.status(500).send({ msg: "internal server error" });
      }
    } else {
      res.status(500).send({ msg: "internal server error" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;

    const require = ["email", "password"];
    const check = validateRequestBody(data, require);

    if (!check) {
      return res.status(400).send({ msg: "Invalid request body." });
    }

    const userExists = await check_LoginDB(data);
    if (userExists) {
      const payload = { id: userExists.id, username: userExists.username, email: userExists.email };
      const accessToken = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
        expiresIn: "10m",
      });

      const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
        expiresIn: "1d",
      });

      // Assigning refresh token in http-only cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).send({ msg: "Login successful", accessToken });
    } else {
      res.status(401).send({ msg: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ msg: "Internal server error." });
  }
};


const GetAllTransactionBundlingRoute = async(req,res)=>{
  try {
    const detail_bundling_transaction = await GetAllTransactionbundling()

    // console.log(detail_bundling_transaction)

    res.status(200).send({msg:"success query",data: detail_bundling_transaction});
    
  } catch (error) {

    res.status(500).send({msg:"internal server error"});
    
  }

}

const GetAllTransactionEventsRoute = async(req,res)=>{
  try {
    const detail_Event_transaction = await GetAllTransactionEvents()

    console.log(detail_Event_transaction)

    res.status(200).send({msg:"success query",data: detail_Event_transaction});
    
  } catch (error) {

    res.status(500).send({msg:"internal server error"});
    
  }

}

const GetAllTransactionMerchandiseRoute = async(req,res)=>{
  try {
    const detail_merchandise_transaction = await GetAllTransactionMerchandise()

    // console.log(detail_merchandise_transaction)

    

    res.status(200).send({msg:"success query",data: detail_merchandise_transaction});
    
  } catch (error) {

    res.status(500).send({msg:"internal server error"});
    
  }

}

const GetAllTransactionCounts = async(req, res) => {
  try {
    const count_transaction_success = await CountTransactionSuccess()

    res.status(200).send({msg:"success query", data:count_transaction_success})
  } catch (error) {
    res.status(500).send({msg:"internal server error"})
    
  }
}


module.exports = { register, login,GetAllTransactionBundlingRoute,GetAllTransactionEventsRoute,GetAllTransactionMerchandiseRoute,GetAllTransactionCounts };
