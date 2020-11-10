require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const app = express();
const port = 4000;
const { SESSION_SECRET, CONNECTION_STRING } = process.env;
const authCtrl = require('./controllers/authControllers');

app.use(express.json());

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  }).then(db => {
    app.set('db', db);
    console.log('db connected');
  });

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



app.listen(port, () => console.log(`Connected to port ${port}`))