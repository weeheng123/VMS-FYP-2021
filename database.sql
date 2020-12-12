CREATE DATABASE VMSusers_database;

--\c into VMSusers_database

CREATE TABLE users(
    users_id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    password VARCHAR(100),
    IC VARCHAR (30),
    UNIT VARCHAR (30),
    role VARCHAR(20)
);