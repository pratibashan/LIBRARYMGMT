DROP DATABASE IF EXISTS librarydb;

CREATE DATABASE librarydb;
\connect librarydb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
    
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    author VARCHAR(50),
    isbn VARCHAR(50),
    availability INTEGER DEFAULT 1,
    description TEXT,
    categoryid INTEGER REFERENCES categories(id) 

);



INSERT INTO users(name,password)VALUES('admin','password');


