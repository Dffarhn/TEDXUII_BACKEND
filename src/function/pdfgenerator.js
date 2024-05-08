const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const https = require("https");
const sharp = require("sharp");
const { GenerateSignedUrl } = require("./supabaseImage");

// Function to generate PDF ticket
async function generateTicket(ticketInfo) {
  return new Promise((resolve, reject) => {
    // Create a document
    const doc = new PDFDocument({ margin: 50 });

    // Set font
    doc.font("Helvetica");

    // Add background color and header
    doc.rect(0, 0, 612, 100).fill("#c62828"); // Red color
    doc.fillColor("#fff").fontSize(32).text("TEDXUII EVENT", { align: "center" });

    // Add event details section
    doc.fontSize(18).fillColor("#000").text("Event Details", 50, 130);

    // Add ticket details
    doc.fontSize(14).text(`ID: ${ticketInfo.id}`, 50, 170);
    doc.text(`Event Title: ${ticketInfo.data_details[0].name}`, 50, 190);
    doc.text(`Date: ${ticketInfo.data_details[0].held_at}`, 50, 210);
    doc.text(`Place: ${ticketInfo.data_details[0].venue}`, 50, 230);
    doc.text(`Quantity: ${ticketInfo.quantity}`, 50, 250);
    doc.text(`Attendee: ${ticketInfo.buyer_details[0].username}`, 50, 270);

    // Generate QR code and embed in PDF
    const qrCodeData = `id:${ticketInfo.id}, name:${ticketInfo.buyer_details[0].username}`;
    QRCode.toDataURL(qrCodeData, { type: "image/png" }, async (err, qrCodeUrl) => {
      if (err) {
        reject(err);
      } else {
        // Embed QR code image in PDF
        doc.image(qrCodeUrl, 400, 120, { width: 200, height: 200 });

        // Generate PDF content as a buffer
        const pdfBuffer = await new Promise((resolvePdf) => {
          const buffers = [];
          doc.on("data", (chunk) => buffers.push(chunk));
          doc.on("end", () => resolvePdf(Buffer.concat(buffers)));
          doc.end();
        });

        resolve(pdfBuffer);
      }
    });

    // Handle error events
    doc.on("error", (err) => {
      reject(err);
    });
  });
}

function fetchImage(url, format = "jpeg") {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        const buffer = Buffer.concat(chunks);
        if (format === "jpeg") {
          const jpgBuffer = await sharp(buffer).jpeg().toBuffer();
          resolve(jpgBuffer);
        } else if (format === "png") {
          const pngBuffer = await sharp(buffer).png().toBuffer();
          resolve(pngBuffer);
        } else {
          reject(new Error("Unsupported image format"));
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function generateTransactionReceipt(transactionInfo) {
  return new Promise(async(resolve, reject) => {
    try{

    console.log(transactionInfo)

    console.log("generating transaction");
    console.log(transactionInfo.data_details[0].image_merchandise)
    // Create a document
    const doc = new PDFDocument({ margin: 50 });

    // Set font
    doc.font("Helvetica");

    // Add background color and header (TEDx color scheme: red, white, black)
    doc.rect(0, 0, 612, 100).fill("#e62b1e"); // TEDx Red
    doc.fillColor("#fff").fontSize(32).text("Merchandise Transaction Receipt", { align: "center" });

    // Add transaction details section
    doc.fontSize(18).fillColor("#000").text("Transaction Details", 50, 130);

    // Add merchandise details for single item
    doc.fontSize(14).text(`Transaction ID: ${transactionInfo.id}`, 50, 170);
    doc.text(`Date: ${transactionInfo.created_at}`, 50, 190);
    doc.text(`Item Name: ${transactionInfo.buyer_details[0].username}`, 50, 210);
    doc.text(`Quantity: ${transactionInfo.quantity}`, 50, 230);
    doc.text(`Price: $${transactionInfo.data_details[0].price}`, 50, 250);
    doc.text(`Total Price: $${transactionInfo.gross_amount}`, 50, 270);

    // Fetch merchandise photo from signed URL using node-fetch
       // Fetch merchandise photo from signed URL using node-fetch
       const imageUrl = await GenerateSignedUrl(transactionInfo.data_details[0].image_merchandise, 60);
       const imageBuffer = await fetchImage(imageUrl,"jpeg");
   
       // Embed merchandise photo in PDF
       doc.image(imageBuffer, 400, 120, { width: 200, height: 200 });
   
       // Generate PDF content as a buffer
       const pdfBuffer = new Promise((resolvePdf) => {
         const buffers = [];
         doc.on("data", (chunk) => buffers.push(chunk));
         doc.on("end", () => resolvePdf(Buffer.concat(buffers)));
         doc.end();
       });
   
       return pdfBuffer;
     } catch(err) {
       throw err;
    }
}
  )}

module.exports = { generateTicket ,generateTransactionReceipt};
