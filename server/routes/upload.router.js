const express = require('express');
const aws = require('aws-sdk')
const multer = require('multer');
const multerS3 = require('multer-s3');
//const { memoryStorage } = require('multer');
//const { v4: uuidv4 } = require('uuid');

aws.config.update({
    secretAccessKey:process.env.AWS_ACCESS_KEY_ID,
    accessKeyId:process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.REGION
})

const s3 = new aws.S3();

const BUCKET = 'first-audio-bucket';

const upload = multer({
    storage:multerS3({
        bucket: BUCKET,
        s3:s3,
        acl: "public-read",
        //cb is for callback
       // key: (req, audiofile, cb) => {
        key: (req, file, cb) => {
           // cb(null,audiofile.originalname);
            cb(null,file.originalname);
        }
    })
})

const router = express.Router();
// const AWS = require('aws-sdk');
// Initialize AWS S3
// const s3 = new AWS.S3({
//   accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
//   secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
// });

// Configure multer to store files in memory temporarily until request completes
//const storage = memoryStorage();
//const upload = multer({ storage });

// Function to upload audio to AWS S3 bucket
// const uploadAudio = (filename, bucketname, file) => {
//   return new Promise((resolve, reject) => {
//     const params = {
//       Key: filename,
//       Bucket: bucketname,
//       Body: Buffer.from(file),
//       ContentType: 'audio/mpeg',
//       ACL: 'public-read',
//     };

//     s3.upload(params, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data.Location);
//       }
//     });
//   });
// };

// Route to handle audio file upload
router.post('/upload', upload.single('file'), (req, res) => {
    console.log( req.file)
  
});

// router.post('/upload', upload.single('audiofile'), async (req, res) => {
//     try {
//       const originalFileName = req.file.originalname;
//       const uuid = uuidv4();
//       const bucketname = 'first-audio-bucket';
//       const filename = `${uuid}-${originalFileName}`;
  
//       const link = await uploadAudio(filename, bucketname, req.file.buffer);
//       console.log(link); // You can send this link in the response if needed
//       res.send('uploaded successfully...');
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error occurred during upload');
//     }
//   });

// router.get('/list', async (req,res) => {
//     s3.listObjectsV2({Bucket: BUCKET}).promise()
//     req.Contents.map(item => item.key);
//     res.send(x)
// })

router.get('/list', async (req, res) => {
    try {
        const data = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
        const keys = data.Contents.map(item => item.Key);
        res.send(keys);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while listing objects');
    }
});


router.get('/download/:filname', async (req,res) => {
    const filename = req.params.filename
    let x = await s3.getObject({Bucket: BUCKET, Key: filename}).promise();
    res.send(x.Body);
})

router.delete('/delete/:filename', async (req, res) => {
    const filename = req.params.filename
    await s3.deleteObject({Bucket: BUCKET, Key: filename}).promise();
    res.send('file deleted')
})

module.exports = router;
