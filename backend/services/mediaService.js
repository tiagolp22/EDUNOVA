const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

class MediaService {
  async uploadFile(file, folder = 'general') {
    const fileId = uuidv4();
    const extension = file.originalname.split('.').pop();
    const key = `${folder}/${fileId}.${extension}`;

    await s3.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();

    return key;
  }

  async getSignedUrl(key, expiresIn = 3600) {
    return s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Expires: expiresIn
    });
  }

  async deleteFile(key) {
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: key
    }).promise();
  }
}

module.exports = new MediaService();