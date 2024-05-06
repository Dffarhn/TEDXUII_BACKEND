const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

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

module.exports = { generateTicket };
