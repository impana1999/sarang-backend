const AWS = require('aws-sdk');
const { promisify } = require('util');
const multer = require('multer');
const path = require('path')
const upload= multer()

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

const compress= async (req, res, next) => {
  try {
    const originalBucketName = process.env.bucket;
    const originalFiles = req.files;
    console.log("originalFiles--allfile data Befr upload-->", originalFiles);
    const compressedFiles = [];
    for (const originalFile of originalFiles) {
      console.log("original file-->",originalFile );
      let originalKey = `uploads/${originalFile.fieldname}_${Date.now()}${path.extname(originalFile.originalname)}`
      const compressedParams = {
        Bucket: originalBucketName,
        Key: originalKey,
        Body: originalFile.buffer
      };
      await s3.upload(compressedParams).promise();
      compressedFiles.push(originalKey.replace('uploads/', ''));
    }
    console.log("Compressed Files:", compressedFiles);
    req.compressedFiles = compressedFiles;
    req.files.forEach((file, index) => file.filename = compressedFiles[index]);
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = { upload, compress };