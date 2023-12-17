const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'movie_ticket_management'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });

  app.get('/sign_in', (req, res) => {
    res.sendFile('D:\\DBMS_project\\web_\\front-end\\sign_in\\sign_in.html');
  });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/sign_in', (req, res) => {
    const email = req.body.EMAIL;
    const password = req.body.password;
  
    // Perform database query to insert user information
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    connection.query(query, [email, password], (err, result) => {
      if (err) {
        console.error('Error executing MySQL query: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      console.log('User added to the database');
      res.status(200).send('User added to the database');
    });
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });  