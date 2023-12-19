const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require('cors');
const { exec } = require('child_process')


const app = express();
const port = 5500;
app.use(cors());

// Set up MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "movie_ticket_management",
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'movie_ticket_management',
  port: 3306,
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
      if(res.status(200)){
        res.sendFile('./view/ticket.html',{root:__dirname})
      }
      
    }
  );
  
});
app.get('/', (req, res) => {
  res.sendFile('/view/ticket.html',{root:__dirname});
});

app.get('/pricing', (req, res) => {
  res.sendFile('/view/pricing.html',{root:__dirname});
});

app.get('/interstellar', (req, res) => {
  res.sendFile('/view/intersellar.html',{root:__dirname});
});


app.get('/updateTicketAndUser', (req, res) => {
  console.log('Received request for /updateTicketAndUser');

  pool.getConnection((err, connection) => {
      console.log('Obtained database connection');
      if (err) {
          console.error('Error getting database connection', err);
          return res.status(500).json({ success: false, message: 'Error getting database connection', error: err.message });
      }

      const movieId = req.query.movieId;

      // Check if tickets are available
      connection.query(`SELECT * FROM tickets WHERE movie_id = ${movieId}`, (error, results) => {
          if (error) {
              connection.release();
              console.error('Error fetching ticket information', error);
              return res.status(500).json({ success: false, message: 'Error fetching ticket information', error: error.message });
          }

          if (results.length > 0 && results[0].quantity > 0) {
              const movieName = results[0].movie_name;

              // Subtract one ticket from the tickets table
              connection.query(`UPDATE tickets SET quantity = quantity - 1 WHERE movie_id = ${movieId}`, (error) => {
                  if (error) {
                      connection.release();
                      console.error('Error updating ticket quantity', error);
                      return res.status(500).json({ success: false, message: 'Error updating ticket quantity', error: error.message });
                  }

                  // Insert a new row into the user_tickets table
                  const currentTime = new Date().toLocaleTimeString();
                  const ticketCode = `TKNO${results[0].quantity + 1}`;

                  connection.query(
                      'INSERT INTO user_tickets (movie_name, time, code) VALUES (?, ?, ?)',
                      [movieName, currentTime, ticketCode],
                      (error) => {
                          connection.release();
                          if (error) {
                              console.error('Error updating user_tickets table', error);
                              return res.status(500).json({ success: false, message: 'Error updating user_tickets table', error: error.message });
                          }

                          console.log('Ticket booked successfully');
                          res.json({ success: true, message: 'Ticket booked successfully' });
                      }
                  );
              });
          } else {
              connection.release();
              console.log('No tickets available');
              res.json({ success: false, message: 'No tickets available' });
          }
      });
  });
});

// app.get('/mytickets', (req, res) => {
//   // Perform database query to fetch all users
//   const query = 'SELECT * FROM user_tickets';
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error('Error executing MySQL query: ' + err.stack);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     // Render HTML with user information
//     const html = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>my_tickets List</title>
//       </head>
//       <body>
//         <h1>my_ticket List</h1>
//         <button id="delete" >delete ticket</button>
//         <ul>
//           ${results.map(user_tickets => `<li>${user_tickets.ticket_id} ${user_tickets.movie_name} ${user_tickets.time} ${user_tickets.code} </li>`).join('')}
//         </ul>
//       </body>
      
//       </html>
//     `;

//     res.send(html);
//   });
// });


// Serve the HTML page with the delete button
app.get('/mytickets', (req, res) => {
  // Fetch and display movies from the database
  const query = 'SELECT * FROM user_tickets';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Render HTML with movie list and delete buttons
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Movies</title>
      </head>
      <body>
        <h1>Movies</h1>
        <ul>
          ${results.map(user_tickets => `
            <li>${user_tickets.movie_name} 
              <form action="/delete" method="post" style="display:inline;">
                <input type="hidden" name="id" value="${user_tickets.ticket_id}">
                <button type="submit">Delete</button>
              </form>
            </li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// Handle the delete button click and delete from MySQL table
app.post('/delete', (req, res) => {
  const movieId = req.body.id;

  // Perform database query to delete movie information
  const query = 'DELETE FROM user_tickets WHERE ticket_id = ?';
  connection.query(query, [movieId], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Movie deleted from the database');
    
  });
});

app.get('/theatre', (req, res) => {
  // Fetch and display movies from the database
  const query = 'SELECT * FROM THEATRE';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Render HTML with movie list and delete buttons
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Movies</title>
      </head>
      <body>
        <h1>Movies</h1>
        <ul>
          ${results.map(THEATRE => `
            <li>${THEATRE.THEATRE_ID} ${THEATRE.movie_name} ${THEATRE.THEATRE_NAME} ${THEATRE.LOCATION} 
              
            </li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// Handle the delete button click and delete from MySQL table
// app.post('/delete', (req, res) => {
//   const movieId = req.body.id;

//   // Perform database query to delete movie information
//   const query = 'DELETE FROM user_tickets WHERE ticket_id = ?';
//   connection.query(query, [movieId], (err, result) => {
//     if (err) {
//       console.error('Error executing MySQL query: ' + err.stack);
//       res.status(500).send('Internal Server Error');
//       return;
//     }

//     console.log('Movie deleted from the database');
    
//   });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




// app.get('/delete_ticket', (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error getting database connection', err);
//         return res.status(500).json({ success: false, message: 'Error getting database connection', error: err.message });
//     }
// });
// // Check if the ticket with the given ID exists
// connection.query(`SELECT * FROM user_tickets WHERE ticket_id = min(ticket_id)`, (error, results) => {
//   if (error) {
//       connection.release();
//       console.error('Error fetching ticket information', error);
//       return res.status(500).json({ success: false, message: 'Error fetching ticket information', error: error.message });
//   }

//   if (results.length > 0) {
//       // Delete the ticket from the user_tickets table
//       connection.query(`DELETE FROM user_tickets WHERE ticket_id = min(ticket_id)`, (error) => {
//           connection.release();
//           if (error) {
//               console.error('Error deleting ticket', error);
//               return res.status(500).json({ success: false, message: 'Error deleting ticket', error: error.message });
//           }

//           console.log('Ticket canceled successfully');
//           res.json({ success: true, message: 'Ticket canceled successfully' });
//       });
//   } else {
//       connection.release();
//       console.log('Ticket not found');
//       res.json({ success: false, message: 'Ticket not found' });
//   }
// });
// });




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
