CREATE DATABASE coffee_tracker;

USE coffee_tracker;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    UNIQUE (email)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    espresso INT,
    lungo INT,
    hotWater INT,
    milk INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

create TABLE machine_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    milk_remaining INT,
    coffee_until_clean INT,
    last_cleaned TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
UPDATE machine_status SET milk_remaining = 20000 WHERE id = (SELECT MAX(id) FROM machine_status);


CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_description VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
