// config/cloudinary.config.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    folder: 'lab-file-upload', // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
    transformation: [
      {width: 500, height: 500, crop: "fill"}
    ]
  }
});

//                     storage: storage
module.exports = multer({ storage });
