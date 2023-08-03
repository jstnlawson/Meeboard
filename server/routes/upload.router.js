const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const uploadRouter = express.Router();
const pool = require('../modules/pool');




AWS.config.update({
  accessKeyId: 'AKIA6K6T4SGUYVILRNZH',
  secretAccessKey: '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',
});

const s3 = new AWS.S3();


const upload = multer({
  storage: multer.memoryStorage(),
});

uploadRouter.post('/', upload.single('audiofile'), (req, res) => {
  const file = req.file;
  const bucket = 'first-audio-bucket';
  const key = `${Date.now().toString()}-${file.originalname}`;

  // Extract sample_name and user_id from the request body
  const { sample_name, user_id } = req.body;

  const params = {
    Bucket: bucket,
    Key: key,
    Body: file.buffer
  };

  s3.upload(params, (error, data) => {
    if (error) {
      console.error('Error uploading to S3', error);
      return res.status(500)
    }

    const audioUrl = data.Location;

    // Save the sample_name, audio_URL, and user_id in the "samples" table
    const insertQuery = `
      INSERT INTO "samples" ("sample_name", "audio_URL", "user_id")
      VALUES ($1, $2, $3)
      RETURNING "id";
    `;
    // Using RETURNING is especially useful when you have auto-incrementing columns 
    // (like a SERIAL or IDENTITY column in PostgreSQL) that generate unique values 
    // for each new row. With RETURNING, you don't need to make an additional query 
    // to fetch the newly generated ID; it's conveniently returned in the same query 
    // result.

    const insertValues = [sample_name, audioUrl, user_id];

    pool.query(insertQuery, insertValues)
      .then((result) => {
        const insertedId = result.rows[0].id;
        return res.json({ insertedId, audioUrl });
      })
      .catch((err) => {
        console.error('Error inserting data into the database', err);
        return res.status(500).json({ error: 'Error inserting data into the database' });
      });
  });
});

// Add a GET route to fetch user's uploads
uploadRouter.get('/:id', (req, res) => {
    const userId = req.params.id;
  
    // Retrieve the user's uploads from the "samples" table based on the user_id
    const selectQuery = `
      SELECT "id", "sample_name", "audio_URL"
      FROM "samples"
      WHERE "user_id" = $1;
    `;
  
    pool.query(selectQuery, [userId])
      .then((result) => {
        // Return the user's uploads as JSON
        return res.json(result.rows);
      })
      .catch((err) => {
        console.error('Error fetching user uploads from the database', err);
        return res.status(500).json({ error: 'Error fetching user uploads from the database' });
      });
  });
  

module.exports = uploadRouter;