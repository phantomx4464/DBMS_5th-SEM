create database movie_ticket_management;
use movie_ticket_management;




create table user_(usr_id INT AUTO_INCREMENT, usr_name varchar(20), phn_no bigint, usr_email varchar(10),password_ varchar(30), primary key(usr_id));
drop table user_;
CREATE TABLE IF NOT EXISTS tickets (
    movie_id INT PRIMARY KEY,
    movie_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL
);
select * from user_;


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
select * from user_tickets;
delete from user_tickets;
-- create table movie (movie_id varchar(10), movie_name varchar(10), primary key(movie_id));
-- create table ticket(booking_id varchar(10), timing time, date_ date, movie_name varchar(10), movie_id varchar(10), primary key(booking_id), foreign key(movie_id) references movie);
-- CREATE TABLE THEATRE(THEATRE_ID INT PRIMARY KEY, THEATRE_NAME VARCHAR(10), LOCATION VARCHAR(20));
-- CREATE TABLE MOVIE_AVAIL(THEATRE_ID INT, MOVIE_AVAILABILITY VARCHAR(20), FOREIGN KEY(THEATRE_ID) REFERENCES THEATRE(THEATRE_ID));

-- drop database movie_ticket_management;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;