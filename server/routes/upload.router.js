const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const uploadRouter = express.Router();
const pool = require('../modules/pool');
//create unique name for uploaded file using uuid
const { v4: uuidv4 } = require('uuid');

require('dotenv').config(); // Load environment variables from .env

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const s3 = new AWS.S3();


const upload = multer({
  storage: multer.memoryStorage(),
});

uploadRouter.post('/', upload.single('audiofile'), (req, res) => {
  const file = req.file;
  const bucket = 'first-audio-bucket';
  //const key = `${Date.now().toString()}-${file.originalname}`;
  const key = `${uuidv4()}-${file.originalname}`;

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

    
    const insertQuery = `
      INSERT INTO "samples" ("sample_name", "audio_URL", "user_id")
      VALUES ($1, $2, $3)
      RETURNING "id";
    `;

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
    //console.log("req.user.id:",req.user.id)
   // const userId = req.user.id;
    const userId = req.params.id;
    
    const selectQuery = `
    SELECT * FROM samples WHERE user_id = $1;
    `;
  
    pool.query(selectQuery, [userId])
      .then((result) => {
        //res.send(result.rows)
        return res.json(result.rows);
      })
      .catch((err) => {
        console.error('Error fetching user uploads from the database', err);
        return res.status(500).json({ error: 'Error fetching user uploads from the database' });
      });
  });

  uploadRouter.delete('/:id', (req, res) => {
    const sampleId = req.params.id;
    const deleteQuery = `DELETE FROM samples WHERE id = $1`;
  
        pool.query(deleteQuery, [sampleId])
          .then(() => {
            // Delete the sample from AWS S3
            const bucket = 'first-audio-bucket';
            const key = sampleId;
  
            const params = {
              Bucket: bucket,
              Key: key,
            };
  
            s3.deleteObject(params, (error, data) => {
              if (error) {
                console.error('Error deleting from S3', error);
                return res.status(500).json({ error: 'Error deleting from S3' });
              }
  
              return res.json({ message: 'Sample deleted successfully' });
            });
          })
          .catch((err) => {
            console.error('Error deleting from the database', err);
            return res.status(500).json({ error: 'Error deleting from the database' });
          });
  });
  
  uploadRouter.put('/:id', (req, res) => {
    // Update this single student
    const idToUpdate = req.params.id;
    const sqlText = `UPDATE samples SET sample_name = $1 WHERE id = $2`;
    pool.query(sqlText, [req.body.sample_name, idToUpdate])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        });
});
  

module.exports = uploadRouter;