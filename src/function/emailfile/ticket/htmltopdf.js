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
      const htmlContent = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Rochester&display=swap"
            rel="stylesheet"
          />
          <style>
            html {
              -webkit-print-color-adjust: exact;
            }
            body {
              font-family: "Poppins", sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 1900px;
              margin: auto;
              padding-bottom: 50px;
              padding-left: 50px;
              padding-right: 50px;
              padding-top: 120px;
              background-color: #000000;
              color: white;
            }
            .upper-part {
              display: flex;
              justify-content: space-between;
              max-width: 1900px;
              align-items: center;
              padding-bottom: 20px;
            }
            .upper-text h1,
            .upper-text h2 {
              font-family: "Poppins", sans-serif;
              margin: 0;
            }
            .upper-text h1 {
              font-size: 50px;
            }
            .upper-text h2 {
              font-size: 40px;
              font-weight: normal;
            }
            .upper-pic {
              justify-content: end;
            }
            .logo {
              margin-right: -370px;
              width: 100%;
            }
            .ticket {
              display: flex;
              justify-content: space-between;
              border: 2px solid #fff;
              padding: 20px;
              background-color: #430b0b;
              background-image: url("https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/FEED_TEDXUII_2_8.png?t=2024-06-04T03%3A31%3A52.992Z");
              background-size: cover;
              background-blend-mode: hard-light;
              background-position: center;
              background-repeat: no-repeat;
      
              height: 438px;
            }
            .vertical-text {
              margin: 0;
              margin-left: -230px;
              margin-top: 160px;
            }
            .vertical {
              white-space: nowrap;
              font-family: "PT Serif", serif;
              font-size: 28px;
              transform: rotate(-90deg);
              background-color: #00000094;
              padding-top: 10px;
              padding-bottom: 15px;
              padding-left: 70px;
              padding-right: 70px;
            }
      
            .bold {
              font-weight: bold;
            }
            .left {
              justify-content: start;
            }
      
            .left .maintext {
              width: 40%;
              margin-top: 15px;
              margin-left: -200px;
              margin-right: 650px;
            }
            
            .QR img {
              width: 370px;
              margin-top: -400px;
              margin-bottom: 50px;
              margin-left: 750px;
            }
      
            .right {
              width: 45%;
            }
            .right .background img {
              width: 350px;
              height: auto;
              margin-top: -495px;
              margin-bottom: 220px;
              margin-left: 1250px;
            }
            .right .background .black {
              width: 592px;
              margin-top: -628px;
              margin-left: 1125px;
              height: auto;
            }
      
            .right .text-up {
              width: 590px;
              margin-top: -800px;
              margin-bottom: 570px;
              margin-left: 1150px;
              height: auto;
            }
            .right .text-up2 {
              width: 430px;
              margin-top: -550px;
              margin-bottom: 590px;
              margin-left: 1150px;
              height: auto;
            }
      
            .left img,
            .right img {
              width: 100%;
              height: auto;
            }
            .left p,
            .right p {
              margin: 10px 0;
            }
      
            .inputs {
              margin-top: -570px;
              margin-bottom: 1000px;
            }
            .input-group {
              margin-top: -530px;
              margin-bottom: 550px;
              bottom: 600px;
              margin-left: 1150px;
              display: flex;
              align-items: center;
              color: white;
              white-space: nowrap;
            }
            .input-group span {
              font-size: 18px;
              margin-right: 20px; /* Adjust spacing between label and input */
            }
            .input-group input {
              width: 600px; /* Adjust width as needed */
              padding: 8px;
              font-size: 15px;
              border: 1px solid #ccc;
              border-radius: 5px;
              white-space: nowrap;
            }
            .input-group input:focus {
              outline: none;
              border-color: #ff0000;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="upper-part">
              <div class="upper-text">
                <h1>THIS IS YOUR TICKET</h1>
                <h2>Present the entire pages at the event</h2>
              </div>
              <div class="upper-pic">
                <img class="logo" src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/tedxlogo.png?t=2024-06-04T03%3A13%3A29.621Z" alt="logo" />
              </div>
            </div>
            <div class="ticket">
              <div class="vertical-text">
                <p class="vertical">TEDXUII 2.0 <span class="bold">MAIN EVENT</span></p>
              </div>
              <div class="left">
                <img class="maintext" src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/maintext.png?t=2024-06-04T03%3A15%3A43.496Z" alt="" />
              </div>
            </div>
            <div class="QR">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="right">
              <div class="background">
                <img src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/tedx.png?t=2024-06-04T03%3A16%3A02.793Z" />
                <img class="black" src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/blackRectangle.png?t=2024-06-04T03%3A16%3A16.616Z" />
              </div>
              <div>
                <img class="text-up" src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/text1.png" />
              </div>
              <div>
                <img class="text-up2" src="https://dcryovkodooolghlrbrj.supabase.co/storage/v1/object/public/TEDXUII/Email/text2.png?t=2024-06-04T03%3A16%3A45.394Z" />
              </div>
              <div class="inputs">
                <div class="input-group">
                  <span>ID :</span>
                  <input type="text" value="${data.id}" />
                </div>
                <div class="input-group">
                  <span>Name :</span>
                  <input type="text" value="${data.buyer_details[0].username}" />
                </div>
                <div class="input-group">
                  <span>Email :</span>
                  <input type="text" value="${data.buyer_details[0].email}" />
                </div>
                <div class="input-group">
                  <span>Email :</span>
                  <input type="text" value="${data.buyer_details[0].email}" />
                </div>

              </div>
            </div>
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
          height: "100px", // Adjust the height as needed
          pageRanges: '1' 
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
