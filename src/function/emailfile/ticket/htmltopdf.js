const puppeteer = require("puppeteer");
const QRCode = require("qrcode"); // Import QRCode module
const { GenerateSignedUrl } = require("../../supabaseImage");
const { GetSpesificMerchandiseById } = require("../../../model/merchandise");

async function generateHTMLPDFEvent(data) {
  return new Promise(async (resolve, reject) => {
    const qrCodeData = JSON.stringify({ id: data.id, name: data.buyer_details[0].username });

    // Generate QR code URL
    QRCode.toDataURL(qrCodeData, async (err, qrCodeUrl) => {
      if (err) {
        console.error("Error generating QR code:", err);
        reject(err);
        return;
      }
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TEDxUII Ticket</title>
          <style>
              html {
                  -webkit-print-color-adjust: exact;
              }

          </style>

      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <div style="width: 1000px; margin: 20px auto; border: 1px solid #ccc;background-image: url('https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/1.png') !important; background-size: cover; background-position: center; color: #fff;">
      
              <!-- Red Overlay -->
              <div style="background-color: rgba(135, 4, 4, 0.778) !important; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
              <div style="padding: 20px; display: flex; align-items: center; justify-content: space-between; background-color: #000 !important ;position: relative; ">
                  <div>
                      <h2 style="margin: 0; font-size: 24px;">THIS IS YOUR TICKET</h2>
                      <p style="margin: 0; font-size: 16px;">Present the entire pages at the event</p>
                  </div>
                  <div>
                      <img src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/2.png" alt="TEDxUII Logo" style="height: 70px;">
                  </div>
              </div>
              <div style="display: flex; margin: 0px 0px 50px 0px;">
                  <div style="width: 30%; padding: 0px; box-sizing: border-box; position: relative; border-right: 1px solid rgba(255, 255, 255, 0.42);">
                      <h3 style="margin: 0; font-size: 24px; padding: 20px 20px 0px 20px;">TICKET</h3>
                      <p style="margin: 0; font-size: 20px;padding: 0px 20px 0px 20px;">IDR ${data.gross_amount}</p>
                      <p style="margin: 0; font-size: 20px;padding: 0px 20px 0px 20px;">Ticket: <span style="color: #FFD700;">#${data.id}</span></p>
                      <div style="margin-top: 10px; background-color:#fff; color: black; height:100%; padding: 10px 20px 0px 20px;";>
                          <p style="margin: 0; font-size: 20px;">Name: ${data.buyer_details[0].username}</p> <br>
                          <p style="margin: 0; font-size: 20px;">Email: ${data.buyer_details[0].email}</p>
                      </div>
                  </div>
                  <div style="width: 50%; padding: 20px; box-sizing: border-box; position: relative; margin-left:20px">
                      <h3 style="margin: 0; font-size: 24px;">DISRUPTION:</h3>
                      <h3 style="margin: 0; font-size: 24px;">UNLOCKING THE FUTURE</h3>
                      <div style="border-radius: 20px; background-color: rgba(0, 0, 0, 0.6); padding: 30px; color: white; margin-top:40px; margin-bottom:20px;">
                          <p style="margin: 0; font-size: 20px;">Date: ${data.data_details[0].held_at}</p>
                          <p style="margin: 0; font-size: 20px;">Time: ${data.data_details[0].time_start}- ${data.data_details[0].time_end}</p>
                          <p style="margin: 0; font-size: 20px;">Location:  ${data.data_details[0].venue}</p>
                      </div>
                      
                      <div style="width: 180px; height: 180px;background-image: url('${qrCodeUrl}'); background-size: cover; background-position: center; position: absolute; bottom: 20px; right: 0px;"></div>
                  </div>
              </div>
              <div style="padding: 60px; background-color: #000 !important; text-align: right;  position: relative; height:100%">
          </div>
      </body>
      </html>
      
            `;

      // Generate QR code data and embed in HTML
      try {
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const page = await browser.newPage();

        // Set content to the HTML
        await page.setContent(htmlContent);
        // Generate PDF and return buffer
        const pdfBuffer = await page.pdf({ 
          format: "A4",
          landscape: true,
          width: "1000px", // Adjust the width as needed
          height: "100px" // Adjust the height as needed
      });

        await browser.close();
        console.log("PDF generated successfully.");
        resolve(pdfBuffer);
      } catch (error) {
        console.error("Error generating PDF:", error);
        reject(error);
      }
    });
  });
}
async function generateHTMLPDFMerchandise(data) {
  return new Promise(async (resolve, reject) => {
    const imageUrl = await GenerateSignedUrl(data.data_details[0].image_merchandise, 30);
    const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TEDx Event Ticket</title>
          <style>
              html {
                  -webkit-print-color-adjust: exact;
              }
              body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 50px;
              background-color: red !important;
              color: #333;
              }
              .ticket-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              padding: 30px;
              margin-top: 20px;
              display: flex; /* Flexbox for layout */
              flex-wrap: wrap; /* Allow items to wrap */
              justify-content: space-between; /* Align items with space between */
              }
              .logo-container {
              text-align: center;
              margin-bottom: 20px;
              flex-basis: 100%; /* Full width for logo container */
              }
              .logo-container img {
              width: 120px;
              }
              .event-details {
              margin-bottom: 20px;
              flex-basis: 100%; /* Full width for event details */
              }
              .event-details h2 {
              color: #d81826; /* TEDx red */
              margin-bottom: 10px;
              }
              .ticket-info {
              margin-bottom: 20px;
              flex-basis: 49%; /* Half width for ticket info */
              }
              .attendee-info {
              margin-bottom: 20px;
              flex-basis: 49%; /* Half width for attendee info */
              }
              .footer {
              font-size: 12px;
              text-align: center;
              background-color: red !important;
              flex-basis: 100%; /* Full width for footer */
              }
              .qr-code {
              flex-basis: 100%; /* Full width for QR code */
              text-align: center;
              }
              .qr-code img {
              width: 200px; /* Adjust QR code image size */
              }
          </style>
          </head>
          <body>
          <div class="ticket-container">
              <div class="logo-container">
              <img src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/2.png" alt="TEDx Logo">
              </div>
              <div class="event-details">
              <h2>TEDxUII Merchandise</h2>
              <p>Date: ${data.created_at}</p>
              <p>Gross amount: Rp.${data.gross_amount}</p>
              </div>
              <div class="ticket-info">
              <p><strong>Merchandise Details:</strong></p>
              <p>Name: ${data.data_details[0].name}</p>
              <p>Price: Rp.${data.data_details[0].price}</p>
              <p>Quantity: ${data.quantity}</p>
              </div>
              <div class="attendee-info">
              <p><strong>Attendee Information:</strong></p>
              <p>Name: ${data.buyer_details[0].username}</p>
              <p>Email: ${data.buyer_details[0].email}</p>
              <p>Phone: ${data.buyer_details[0].phone_number}</p>
              </div>
              <div class="qr-code">
                  <img src="${imageUrl}" alt="QR Code">
              </div>
              <div class="footer">
              <p>Thank you for being a valued supporter of TEDXUII!</p>
              <p>Follow us on Instagram <a href="https://www.instagram.com/tedxuii" target="_blank">@tedxuii</a></p>
              </div>
          </div>
          </body>
          </html>
          `;

    try {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();

      // Set content to the HTML
      await page.setContent(htmlContent);
      // Generate PDF and return buffer
      const pdfBuffer = await page.pdf({ format: "A4" });

      await browser.close();
      console.log("PDF generated successfully.");
      resolve(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
}
async function generateHTMLPDFBundling(data) {
  return new Promise(async (resolve, reject) => {
    const GetMerchandisePromises = data.data_details[0].list_bundling.map(async (item) => {
      return await GetSpesificMerchandiseById(item);
    });
    const GetMerchandise = await Promise.all(GetMerchandisePromises);

    const GetimagesPromises = GetMerchandise.map(async (item, index) => {
      // console.log(item);
      return item[0].image_merchandiseURL;
    });
    const getimages = await Promise.all(GetimagesPromises);

    // resolve(getimages)
    // console.log(imageBundling)
    const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TEDx Event Bundling</title>
          <style>
              html {
                  -webkit-print-color-adjust: exact;
              }
              body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 50px;
              background-color: red !important;
              color: #333;
              }
              .ticket-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              padding: 30px;
              margin-top: 20px;
              display: flex; /* Flexbox for layout */
              flex-wrap: wrap; /* Allow items to wrap */
              justify-content: space-between; /* Align items with space between */
              }
              .logo-container {
              text-align: center;
              margin-bottom: 20px;
              flex-basis: 100%; /* Full width for logo container */
              }
              .logo-container img {
              width: 120px;
              }
              .event-details {
              margin-bottom: 20px;
              flex-basis: 100%; /* Full width for event details */
              }
              .event-details h2 {
              color: #d81826; /* TEDx red */
              margin-bottom: 10px;
              }
              .ticket-info {
              margin-bottom: 20px;
              flex-basis: 49%; /* Half width for ticket info */
              }
              .attendee-info {
              margin-bottom: 20px;
              flex-basis: 49%; /* Half width for attendee info */
              }
              .footer {
              font-size: 12px;
              text-align: center;
              background-color: red !important;
              flex-basis: 100%; /* Full width for footer */
              }
              .qr-code {
              flex-basis: 100%; /* Full width for QR code */
              text-align: center;
              }
              .qr-code img {
              width: 200px; /* Adjust QR code image size */
              }
          </style>
          </head>
          <body>
          <div class="ticket-container">
              <div class="logo-container">
              <img src="tedx_logo.png" alt="TEDx Logo">
              </div>
              <div class="event-details">
              <h2>TEDxUII Bundling</h2>
              <p>Date: ${data.created_at}</p>
              <p>Gross amount: Rp.${data.gross_amount}</p>
              </div>
              <div class="ticket-info">
              <p><strong>Bundling Details:</strong></p>
              <p>Name: ${data.data_details[0].name}</p>
              <p>Price: Rp.${data.data_details[0].price}</p>
              <p>Quantity: ${data.quantity}</p>
              </div>
              <div class="attendee-info">
              <p><strong>Attendee Information:</strong></p>
              <p>Name: ${data.buyer_details[0].username}</p>
              <p>Email: ${data.buyer_details[0].email}</p>
              <p>Phone: ${data.buyer_details[0].phone_number}</p>
              </div>
              <div class="qr-code">
                    ${getimages.map((item) => `<img src="${item}" alt="Merchandise Image">`).join("")}
                </div>
              <div class="footer">
              <p>Thank you for being a valued supporter of TEDXUII!</p>
              <p>Follow us on Instagram <a href="https://www.instagram.com/tedxuii" target="_blank">@tedxuii</a></p>
              </div>
          </div>
          </body>
          </html>
          `;

    try {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();

      // Set content to the HTML
      await page.setContent(htmlContent);
      // Generate PDF and return buffer
      const pdfBuffer = await page.pdf({ format: "A4" });

      await browser.close();
      console.log("PDF generated successfully.");
      resolve(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
}

module.exports = { generateHTMLPDFEvent, generateHTMLPDFMerchandise, generateHTMLPDFBundling };
