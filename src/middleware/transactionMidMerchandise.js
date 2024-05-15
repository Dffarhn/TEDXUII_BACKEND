
const { GetSpesificMerchandiseById } = require("../model/merchandise");

async function CheckMerchandise(req) {
  const { id_merchandise } = req.body;
  console.log(id_merchandise);

  const data = await GetSpesificMerchandiseById(id_merchandise);
  if (data.length > 0) {
    return data[0];
  } else {
    throw new Error();
  }
}

module.exports = { CheckMerchandise };
