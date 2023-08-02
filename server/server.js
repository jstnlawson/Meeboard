const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the 'cors' package

//require('dotenv').config();

const app = express();

app.use(cors()); // Enable CORS for all routes

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const uploadRouter = require('./routes/upload.router')

//These lines configure middleware in express to handle incoming 
//JSON data and URL-encoded form data from client requests.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/upload', uploadRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
