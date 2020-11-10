require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const app = express();
const port = 4000;
const { SESSION_SECRET, CONNECTION_STRING } = process.env;
const authCtrl = require('./controllers/authControllers');
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')
app.use(express.json());

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  }).then(db => {
    app.set('db', db);
    console.log('db connected');
  }).catch(err => console.log(err));

//top-level middleware
app.use(
    session({
      resave: true,
      saveUninitialized: false,
      secret: SESSION_SECRET,
    })
  );
  
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
//This middleware function should now be able to ensure that a user is an admin before the request gets passed on to the final controller function.
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


app.listen(port, () => console.log(`Connected to port ${port}`))