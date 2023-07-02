const multer = require("multer");
const catchAsync = require("./catchAsync");
const sharp = require("sharp");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, 'public/assets/images/');
//     } else if (file.mimetype === 'image/svg+xml') {
//       cb(null, 'public/assets/icons/');
//     } else {
//       cb(new Error('Invalid file type'));
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });

// module.exports = upload;
exports.uploadSingle = upload.single("image");

exports.uploadMultiple = upload.array("image", 2);

// Photo Resize
exports.resizeProductPhoto = async (req, res, next) => {
  if (!req.files && !req.file) return next();

  let { purpose } = req.body ;


  if (req.query && req.query.purpose) {
    purpose = req.query.purpose;
  }

  if (req.file) {
    req.files = [req.file];
  }

  const fileDetails = [];

  // Loop through each file and resize them
  req.files.forEach((file) => {
    const filename = `${Date.now()}.jpeg`;

    let resizeOptions = { width: 800, height: 700 };

    // Set specific resize options based on the purpose
    if (purpose == "banner") {
      resizeOptions = { width: 1920, height: 800 };
    } else if (purpose == "profile") {
      resizeOptions = { width: 200, height: 200 };
    } else if (purpose == "category") {
      resizeOptions = { width: 554, height: 264 };
    }

    sharp(file.buffer)
      .resize(resizeOptions.width, resizeOptions.height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/assets/images/${filename}`);

    fileDetails.push({
      filename,
      path: `public/assets/images/${filename}`,
    });
  });

  // If it's a single file upload, directly store the filename
  const resizedFiles =
    fileDetails.length === 1 ? fileDetails[0].path : fileDetails;

  // Pass the resized files to the next route

  req.fileDetails = resizedFiles;


  next();
};
