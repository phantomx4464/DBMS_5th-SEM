const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 5500;

app.use(cors());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'movie_ticket_management',
    port: 3306,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('view'))
app.get('/', (req, res) => {
    res.sendFile('/view/ticket.html',{root:__dirname});
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
   
});
