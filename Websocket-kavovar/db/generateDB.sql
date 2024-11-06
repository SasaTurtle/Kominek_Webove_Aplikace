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

INSERT INTO `coffee_tracker`.`machine_status`
(`id`,
`milk_remaining`,
`coffee_until_clean`,
`last_cleaned`)
VALUES
(1,
20000,
20,
now());


CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_description VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
