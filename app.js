require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// extra security packages

//helmet
const helmet = require('helmet')
// cors
const cors = require('cors')
// xss-clean
const xss = require('xss-clean')
//express rate limit
const rateLimiter = require('express-rate-limit')


//connect db
const connectDB = require('./db/connect')
//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//auth 
const authenticateUser = require('./middleware/authentication')

app.use(express.json())

app.set('trust proxy',1) // as mentioned in their docs, if we use any other server like herku etc, then set this thing up

// using the security pkgs
app.use(rateLimiter({
  windowMs : 15*60*1000, // 15 minutes
  max : 100 // limit each IP to 100 requests per windowMs
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// extra packages

// routes
app.use('/api/auth',authRouter)
app.use('/api/jobs',authenticateUser,jobsRouter)

// NOTE : NEW CONCEPT --> app.use(path,router) =  When this path is called then the appropriate router will be executed

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB('mongodb://127.0.0.1:27017/Project-1--Jobs-Api')
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
