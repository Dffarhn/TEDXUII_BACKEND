const multer = require("multer");
const sharp = require("sharp");
// const path = require("path");
// const fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const { supabase } = require("../../supabaseBucket.js");
const { GetSpesificEventById } = require("../model/event.js");
const { GetSpesificMerchandiseById } = require("../model/merchandise.js");
// const eventsStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/assets/event/"); // Specify the destination folder for event files
//   },
//   filename: function (req, file, cb) {
//     cb(null, `event-${uuidv4()}` + path.extname(file.originalname)); // Generate a unique filename for events
//   },
// });

// const merchandiseStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/assets/merchandise/"); // Specify the destination folder for merchandise files
//   },
//   filename: function (req, file, cb) {
//     cb(null, `merchandise-${uuidv4()}` + path.extname(file.originalname)); // Generate a unique filename for merchandise
//   },
// });

// const eventsUpload = multer({ storage: eventsStorage });
// const merchandiseUpload = multer({ storage: merchandiseStorage });

const events_storage = multer.memoryStorage()
const eventsUpload = multer({ storage: events_storage });

const merchandise_storage = multer.memoryStorage();
const merchandiseUpload = multer({ storage: merchandise_storage });

async function convertToWebP(req, res, next) {
  if (!req.file) {
    // console.log(here)
    req.image = null
    return next();
  }

  console.log(req.file);

  const originalFile = req.file.buffer;


  let uuid = uuidv4();

  let uploadType = ''; // Variable to store the upload type (event or merchandise)

  // Check the fieldname to determine the upload type
  if (req.file.fieldname === 'eventFile') {
    uploadType = 'event';
    if (req.params.id_event) {
      const image_past = await GetSpesificEventById(req.params.id_event)
      // console.log(image_past[0].image)
      uuid = image_past[0].image
      
    }
  } else if (req.file.fieldname === 'merchandiseFile') {
    uploadType = 'merchandise';
    if (req.params.id_merchandise) {
      const image_past = await GetSpesificMerchandiseById(req.params.id_merchandise)
      // console.log(image_past[0].image)
      uuid = image_past[0].image_merchandise[0]
      
    }
  } else {
    // Handle other upload types or unknown fieldnames
    return next(new Error('Unknown upload type'));
  }

  sharp(originalFile)
    .webp()
    .toBuffer()
    .then(async (webpData) => {
      // Upload the WebP buffer to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('TEDXUII') // Assuming 'TEDXUII' is your Supabase bucket name
        .upload(`${uploadType}/${uuid}`, webpData, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new error("gagal konversi image try another image");
      }

      // Delete the original file after upload
      await sharp.cache(false); // Clear sharp's cache to release the file lock
      await sharp(originalFile).toBuffer(); // Ensure sharp finishes processing before deletion
      req.image = `${uploadType}/${uuid}`
      next(); // Call next middleware or route handler after successful conversion and upload
    })
    .catch((err) => {
      console.error("Error converting image to WebP or uploading to Supabase:", err);
      next(err); // Pass the error to the next middleware or route handler
    });
}

// Middleware to process uploaded images into WebP format
// function convertToWebP(req, res, next) {
//   if (!req.file) {
//     return next();
//   }

//   console.log(req.file.path);

//   const originalFilePath = req.file.path;
//   const webpFilePath = path.join(path.dirname(originalFilePath), path.basename(originalFilePath, path.extname(originalFilePath)) + ".webp");

//   sharp(originalFilePath)
//     .webp()
//     .toFile(webpFilePath)
//     .then(() => {
//       // Delete the original file after conversion
//       fs.unlink(originalFilePath, (err) => {
//         if (err) {
//           console.error("Error deleting original file:", err);
//           next(err); // Pass the error to the next middleware or route handler
//         } else {
//           // Update the request object with the path to the WebP file
//           req.file.path = webpFilePath;
//           next(); // Call next middleware or route handler after successful conversion and deletion
//         }
//       });
//     })
//     .catch((err) => {
//       console.error("Error converting image to WebP:", err);
//       next(err); // Pass the error to the next middleware or route handler
//     });
// }



module.exports = { eventsUpload, merchandiseUpload, convertToWebP };
