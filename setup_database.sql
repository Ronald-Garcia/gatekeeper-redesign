-- Create the database
CREATE DATABASE team10_db;

-- Connect to the database
\c team10_db;

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INT REFERENCES users(id)
);

-- Insert initial data (optional)
INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com');

INSERT INTO tasks (title, description, user_id) VALUES
('Task 1', 'This is task 1', 1),
('Task 2', 'This is task 2', 2);