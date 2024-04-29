const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://bouncer-email-verification.p.rapidapi.com/v1/email/verify',
  params: {
    email: 'd.raihan2004@gmail.com',
    timeout: '10'
  },
  headers: {
    'X-RapidAPI-Key': '033b605b5emshcbad049ce2d3646p1c673bjsn3d35d228c5b9',
    'X-RapidAPI-Host': 'bouncer-email-verification.p.rapidapi.com'
  }
};

async function tes(options) {
  const response = await axios.request(options);
  
}


async function main(options) {
  
  try {
    const response = await tes(options)
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}


main(options)