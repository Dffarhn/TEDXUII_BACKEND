const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require("uuid");
const eventsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/event/'); // Specify the destination folder for event files
  },
  filename: function (req, file, cb) {
    cb(null, `event-${uuidv4()}`+ path.extname(file.originalname)); // Generate a unique filename for events
  },
});

const merchandiseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/merchandise/'); // Specify the destination folder for merchandise files
  },
  filename: function (req, file, cb) {
    cb(null, `merchandise-${uuidv4()}`+ path.extname(file.originalname)); // Generate a unique filename for merchandise
  },
});

const eventsUpload = multer({ storage: eventsStorage });
const merchandiseUpload = multer({ storage: merchandiseStorage });

// Middleware to process uploaded images into WebP format
function convertToWebP(req, res, next) {
  if (!req.file) {
    return next();
  }

  console.log(req.file.path)

  const originalFilePath = req.file.path;
  const webpFilePath = path.join(path.dirname(originalFilePath), path.basename(originalFilePath, path.extname(originalFilePath)) + '.webp');



  sharp(originalFilePath)
  .webp()
  .toFile(webpFilePath)
  .then(() => {
    // Delete the original file after conversion
    fs.unlink(originalFilePath, (err) => {
      if (err) {
        console.error('Error deleting original file:', err);
        next(err); // Pass the error to the next middleware or route handler
      } else {
        // Update the request object with the path to the WebP file
        req.file.path = webpFilePath;
        next(); // Call next middleware or route handler after successful conversion and deletion
      }
    });
  })
  .catch((err) => {
    console.error('Error converting image to WebP:', err);
    next(err); // Pass the error to the next middleware or route handler
  });
}

module.exports = { eventsUpload, merchandiseUpload, convertToWebP };
