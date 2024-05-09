const dotenv = require("dotenv");
const { generateTicket, generateTransactionReceipt } = require("./pdfgenerator");
dotenv.config();

const Mailjet = require("node-mailjet");
const { generateHTMLPDF } = require("./htmltopdf");
const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

async function sendEmail(data,category) {
  return new Promise(async (resolve, reject) => {
    let pdfBuffer = null
    let filename = null
    let request = null

    if (category ==="event") {    
       pdfBuffer = await generateHTMLPDF(data);
       filename = "ticket.pdf";
      request = mailjet.post("send", { version: "v3.1" }).request({
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
                 Filename: filename,
                 Base64Content: pdfBuffer.toString("base64"),
               },
             ],
           },
         ],
       });
    }else if (category ==="merchandise") {
      pdfBuffer = await generateTransactionReceipt(data); 
      filename = "recipient_merchandise.pdf";
      request = mailjet.post("send", { version: "v3.1" }).request({
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
            Subject: "Your Recipient for TEDXUII Merchandise",
            TextPart: "Greetings from TEDXUII!",
            HTMLPart: `<h3>Dear ${data.buyer_details[0].username},</h3>
            <p>Thank you for your purchase!</p>
            <p>Please find attached your Recipient for the TEDXUII Merchandise.</p>
            <p>Thank you for being a valued supporter of TEDXUII!</p>`,
            Attachments: [
              {
                ContentType: "application/pdf",
                Filename: filename,
                Base64Content: pdfBuffer.toString("base64"),
              },
            ],
          },
        ],
      });
    }

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
