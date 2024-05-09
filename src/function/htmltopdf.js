const puppeteer = require('puppeteer');
const QRCode = require('qrcode'); // Import QRCode module

async function generateHTMLPDF(data) {
  return new Promise(async(resolve, reject) => {
    const qrCodeData = JSON.stringify({ id: data.id, name: data.buyer_details[0].username });

    // Generate QR code URL
    QRCode.toDataURL(qrCodeData, async (err, qrCodeUrl) => {
      if (err) {
        console.error('Error generating QR code:', err);
        reject(err);
        return;
      }
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
          <img src="tedx_logo.png" alt="TEDx Logo">
        </div>
        <div class="event-details">
          <h2>TEDxUII</h2>
          <p>Date: ${data.data_details[0].held_at}</p>
          <p>Venue: ${data.data_details[0].venue}</p>
        </div>
        <div class="ticket-info">
          <p><strong>Ticket Details:</strong></p>
          <p>Ticket id: ${data.id}</p>
          <p>Name Event: ${data.data_details[0].name}</p>
          <p>Price: ${data.data_details[0].price}</p>
        </div>
        <div class="attendee-info">
          <p><strong>Attendee Information:</strong></p>
          <p>Name: ${data.buyer_details[0].username}</p>
          <p>Email: ${data.buyer_details[0].email}</p>
          <p>Phone: ${data.buyer_details[0].phone_number}</p>
        </div>
        <div class="qr-code">
            <img src="${qrCodeUrl}" alt="QR Code">
        </div>
        <div class="footer">
          <p>This ticket is non-transferable and must be presented upon entry.</p>
          <p>Follow us on Twitter @TEDxHandle</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Generate QR code data and embed in HTML
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
  
        // Set content to the HTML
        await page.setContent(htmlContent);  
        // Generate PDF and return buffer
        const pdfBuffer = await page.pdf({ format: 'A4' });
  
        await browser.close();
        console.log('PDF generated successfully.');
        resolve(pdfBuffer);
      } catch (error) {
        console.error('Error generating PDF:', error);
        reject(error);
      }

    })
  });
}

module.exports = {generateHTMLPDF}