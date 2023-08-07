const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the 'cors' package

//require('dotenv').config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // Update with your client's URL
  methods: 'GET,POST, DELETE',
  allowedHeaders: 'Authorization',
  credentials: true, // If you're using cookies or authentication headers
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
  // Other options...
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // If needed

  // Pass to the next middleware
  next();
});


app.use(cors()); // Enable CORS for all routes
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your app's domain
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

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
