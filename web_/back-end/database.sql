create database movie_ticket_management;
use movie_ticket_management;

create table user_(usr_id varchar(10), usr_name varchar(20), phn_no bigint, usr_email varchar(10),t_quant bigint, t_no bigint, primary key(user_id));
create table movie (movie_id varchar(10), movie_name varchar(10), primary key(movie_id));
create table ticket(booking_id varchar(10), timing time, date_ date, movie_name varchar(10), movie_id varchar(10), primary key(booking_id), foreign key(movie_id) references movie);
CREATE TABLE THEATRE(THEATRE_ID INT PRIMARY KEY, THEATRE_NAME VARCHAR(10), LOCATION VARCHAR(20));
CREATE TABLE MOVIE_AVAIL(THEATRE_ID INT, MOVIE_AVAILABILITY VARCHAR(20), FOREIGN KEY(THEATRE_ID) REFERENCES THEATRE(THEATRE_ID));