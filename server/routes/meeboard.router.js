const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const meeboardRouter = express.Router();
const pool = require('../modules/pool');

require('dotenv').config(); // Load environment variables from .env

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();


const upload = multer({
  storage: multer.memoryStorage(),
});

// Add a GET route to fetch user_sample that goes to meeboard
meeboardRouter.get('/:id', (req, res) => {
    //console.log("req.user.id:",req.user.id)
   // const userId = req.user.id;
    const sampleId = req.params.id;
    
    const selectQuery = `
    SELECT "audio_URL" FROM samples WHERE id = $1;
    `;
  
    pool.query(selectQuery, [sampleId])
      .then((result) => {
        console.log('sampleId:', sampleId);
      console.log('result.rows:', result.rows);
        //res.send(result.rows)
        //return res.json(result.rows);
        //return res.json(result.rows[0].audio_url);
        return res.json({ audio_URL: result.rows[0].audio_URL });
      })
      .catch((err) => {
        console.error('Error fetching meeboard sample from the database', err);
        return res.status(500).json({ error: 'Error fetching meeboard sample from the database' });
      });
  });

  module.exports = meeboardRouter;