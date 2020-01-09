const AWS = require('aws-sdk');
const configKeys = require('../../config_keys');
const sharp = require('sharp');
const { extname } = require("path");

AWS.config.update({
  accessKeyId: configKeys.AWS_ACESS_KEY,
  secretAccessKey: configKeys.AWS_SECRET_KEY,
  region: configKeys.REGION
});

const s3 = new AWS.S3();

const store = async (req, res) => {
  const { file, user, body : { docName } } = req;

  console.log(user);

  const awsDocName = `${user._id}/${docName}`;

  try {
    
    const optimized = await sharp(file.buffer)
      .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
      .toFormat("jpeg", { progressive: true, quality: 50 })
      .toBuffer();

    await s3.putObject({
      Body: optimized,
      Bucket: configKeys.BUCKET,
      ContentType: `${file.mimetype}`,
      Key: `compressed/${awsDocName}.jpg`
    }).promise();

    await s3.putObject({
      Body: file.buffer,
      Bucket: configKeys.BUCKET,
      Key: `uploads/${awsDocName}${extname(file.originalname)}`
    }).promise();

    return res.json({message: 'Upload das imagens realizado com sucesso!'});
    
  } catch(err) {

    return res.boom.badRequest('Images could not be uploaded!', {
      err
    });
  }
}

const show = async (req, res) => {

  const { user ,body: {docType} } = req;

  console.log(`compressed/${user._id}/${docType}.jpgx`);

  try {

    const file = await s3.getObject({
      Bucket: configKeys.BUCKET,
      Key: `compressed/${user._id}/${docType}.jpg`,
    }).promise();
    
    return res.json({imageFile: file});
    

  } catch(err) {
    return res.boom.badRequest('Document not found');
  }
  
}

module.exports = {
  store,
  show
}