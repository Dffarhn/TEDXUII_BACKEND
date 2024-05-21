const dotenv = require("dotenv");
dotenv.config();
const Mailjet = require("node-mailjet");
const { generateHTMLPDFEvent, generateHTMLPDFMerchandise, generateHTMLPDFBundling } = require("./emailfile/ticket/htmltopdf");
const { emailbody } = require("./emailfile/body/emailbody");
const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

async function sendEmail(data, category) {
  return new Promise(async (resolve, reject) => {
    let pdfBuffer = null;
    let filename = null;
    let request = null;
    const htmlContent = emailbody(data, category);

    if (category === "event") {
      pdfBuffer = await generateHTMLPDFEvent(data);
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
            HTMLPart: htmlContent,
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
    } else if (category === "merchandise") {
      pdfBuffer = await generateHTMLPDFMerchandise(data);
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
            HTMLPart: htmlContent,
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
    } else if (category === "bundling") {
      pdfBuffer = await generateHTMLPDFBundling(data);
      filename = "recipient_Bundling.pdf";
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
            Subject: "Your Recipient for TEDXUII Bundling",
            TextPart: "Greetings from TEDXUII!",
            HTMLPart: htmlContent,
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
