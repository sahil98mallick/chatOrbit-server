const ImageKit = require("imagekit");
const multer = require("multer");

// / Image Cloud Server Setup
const imagekit = new ImageKit({
  publicKey: "public_Si93pSkoQAbQ3cMRRj5aAW+Lgwk=",
  privateKey: "private_PXIsikXskmXAd6MaBU+f2BqsnwA=",
  urlEndpoint: "https://ik.imagekit.io/cqxtcg0kv",
});

// Define the storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload image to ImageKit
const uploadImage = async (file) => {
  return await imagekit.upload({
    file: file.buffer,
    fileName: file.originalname,
    folder: "ChatorbitProfileImages",
  });
};

// Exporting the upload middleware and uploadImage function
module.exports = {
    upload,
    uploadImage
  };