
CREATE DATABASE IF NOT EXISTS ticket;

USE ticket;

-- Create a table to store movie tickets
CREATE TABLE IF NOT EXISTS tickets (
    movie_id INT PRIMARY KEY,
    movie_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL
);

INSERT INTO tickets (movie_id, movie_name, quantity) VALUES
(1, 'Interstellar', 10),
(2, 'Baby''s Day Out', 8),
(3, 'The Avengers', 15),
(4, 'Movie 4', 5),
(5, 'Movie 5', 12);

CREATE TABLE IF NOT EXISTS user_tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_name VARCHAR(255) NOT NULL,
    time VARCHAR(20) NOT NULL,
    code VARCHAR(20) NOT NULL
);
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Dh@nvi2123';
select * from user_tickets;
select * from tickets;


#drop database ticket;

