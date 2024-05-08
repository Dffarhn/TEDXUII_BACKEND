const dotenv = require("dotenv");
const { generateTicket, generateTransactionReceipt } = require("./pdfgenerator");
dotenv.config();

const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

async function sendEmail(data,category) {
  return new Promise(async (resolve, reject) => {
    let pdfBuffer = null

    if (category ==="event") {    
       pdfBuffer = await generateTicket(data);
    }else if (category ==="merchandise") {
      pdfBuffer = await generateTransactionReceipt(data); 
    }
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_ADDRESS,
            Name: "TEDXUII",
          },
          To: [
            {
              Email: data.buyer_details[0].email,
              Name: data.buyer_details[0].username,
            },
          ],
          Subject: "Your Ticket for TEDXUII Event",
          TextPart: "Greetings from TEDXUII!",
          HTMLPart: `<h3>Dear ${data.buyer_details[0].username},</h3><p>Please find attached your ticket for the TEDXUII event.</p>`,
          Attachments: [
            {
              ContentType: "application/pdf",
              Filename: "ticket.pdf",
              Base64Content: pdfBuffer.toString("base64"),
            },
          ],
        },
      ],
    });

    request
      .then((result) => {
        resolve(result.body);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { sendEmail };
