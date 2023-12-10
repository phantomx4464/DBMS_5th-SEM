create database movie_ticket_management;
use movie_ticket_management;

create table user_(usr_id varchar(10), usr_name varchar(20), phn_no bigint, usr_email varchar(10),t_quant bigint, t_no bigint, primary key(user_id));
create table movie (movie_id varchar(10), movie_name varchar(10), primary key(movie_id));
create table ticket(booking_id varchar(10), timing time, date_ date, movie_name varchar(10), movie_id varchar(10), primary key(booking_id), foreign key(movie_id) references movie);
