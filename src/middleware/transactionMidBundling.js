const { GetSpesificBundlingById } = require("../model/bundling");

async function CheckBundling(req) {
  const { id_bundling } = req.body;
  // console.log(id_bundling)

  const data = await GetSpesificBundlingById(id_bundling);
  if (data.length > 0) {
    return data[0];
  } else {
    throw new Error();
  }
}

module.exports = { CheckBundling };
