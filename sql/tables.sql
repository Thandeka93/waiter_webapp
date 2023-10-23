CREATE TABLE waiters (
    id SERIAL PRIMARY KEY, 
    waiter_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE weekdays (
    id SERIAL PRIMARY KEY,
    day VARCHAR(255)
);

CREATE TABLE admin_table (
    id SERIAL PRIMARY KEY,
    waiter_id INT,
    day_id INT,
    FOREIGN KEY (waiter_id) REFERENCES waiters(id),
    FOREIGN KEY (day_id) REFERENCES weekdays(id)
);









