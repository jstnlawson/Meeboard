const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const AWS = require('aws-swk')
//multer gives access to the file in the buffer, we grab from there and upload to S3 bucket
const multer = require('multer')
//store file from page to the "memory" temporarly until request complete
const {memoryStorage} = require('multer')
const storage = memoryStorage()
const upload = multer({storage})
//function to upload
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
/**
 * GET route template
 */
router.get('/', (req, res) => {
  // GET route code here
});

//function to upload


const uploadAudio = (filename, bucketname, file) => {

  //Set up this promise, I think this is mostly to resolve
  //logging issues
 return new Promise((resolve, reject) => {
  const params = {
      Key: filename,
      Bucket: bucketname,
      Body: fileURLToPath,
      //ContentType is important if you're using audio, this lets s3 
      //know what it is before it starts downloading
      ContentType: 'audio/mpeg',
      //this 'public_read' make the audio playable through the URL
      ACL: 'public-read'
  }

  s3.upload(params, (err,data)=>{
     if(err) {
      reject(err)
     } else {
      //adding location returns the link only
      resolve(data.Location)
     } 
  })
 }) 
}

  // POST route code here

// router.post('/upload', upload.single('audiofile'), async (req, res) => {
//   //I have to change this filename manually to upload right now
//   //This will be an input.value thing on my app
//   const filename = 'my first upload'
//   const bucketname = 'first-audio-bucket'
//   //I think the buffer is multer temporarly holding the file??
//   const file = req.file.buffer
//   console.log(file)
//   //the async and await resolve logging issues, you should see
//   //loading in postman while it "awaits"
//   const link = await uploadAudio(filename, bucketname, file)
//   console.log(link)
//   res.send('uploaded successfully...')
// })

router.post('/upload', upload.single('audiofile'), async (req, res) => {
  try {
    // Extract the necessary information from the request
    const { filename, originalname } = req.file;
    //I have to change this filename manually to upload right now
    //I think this will be an input.value thing on my app
    const bucketname = 'first-audio-bucket'; // Replace this with your bucket name
    //I think the buffer is multer temporarly holding the file??
    const file = req.file.buffer;

    // Upload the audio file to S3 and get the URL
    const audioUrl = await uploadAudio(filename, bucketname, file);

    // Extract the user_id from the request if applicable (assuming it's in the request body)
    const { user_id } = req.body;

    // Insert the audio information into the database
    const queryText =
      'INSERT INTO "samples" ("sample_name", "audio_url", "user_id") VALUES ($1, $2, $3) RETURNING *';
    const values = [originalname, audioUrl, user_id];

    // database query
    const result = await pool.query(queryText, values);

    // Send a response to the client indicating success
    res.status(201).json({ message: 'File uploaded successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});
//TEST S3 IN POSTMAN: POST localhost:????/upload
//IN BODY/KEY: audiofile
//on the right side of the KEY box is a dropdown where you can change
// the VALUE to file. 
//Select an audio file
//CONTENT TYPE: multipart/form-data
//You should get a link in server console

module.exports = router;
