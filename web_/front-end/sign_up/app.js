const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 5500;

// Set up MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "movie_ticket_management",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});
app.use(express.static('view'))
app.get("/sign_up", (req, res) => {
  res.sendFile(
    "./view/sign_up.html",{root:__dirname}
  );
  
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/sign_up", (req, res) => {
  const name = req.body.name;
  const phn_no = req.body.phone;
  const usr_email = req.body.email;
  const password = req.body.password;

  // Perform database query to insert user information
  const query = `INSERT INTO user_ (usr_name, phn_no,usr_email, password_) VALUES (?, ?,?,?)`;
  connection.query(
    query,[name, phn_no, usr_email, password],(err, result) => {
      if (err) {
        console.error("Error executing MySQL query: " + err.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      console.log("User added to the database");
      res.status(200).redirect('./ticket.html');
    }
  );
  
});

// app.get('/buy', (req, res) => {
//   res.sendFile('./view/user.html',{root:__dirname});
// });
// app.post('/buy', (req, res) => {
//   const movieName = 'Interstellar';

//   // Perform database query to insert movie information
//   const query = 'INSERT INTO purchased_movies (movie_name) VALUES (?)';
//   connection.query(query, [movieName], (err, result) => {
//     if (err) {
//       console.error('Error executing MySQL query: ' + err.stack);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     console.log('Movie purchased and added to the database');
//     res.status(200).send('Movie purchased and added to the database');

//   });
  
// });
  



// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
