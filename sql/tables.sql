CREATE TABLE waiters (
    id SERIAL PRIMARY KEY, 
    waiter_name VARCHAR(255) NOT NULL
);

CREATE TABLE day_of_the_week (
    id SERIAL PRIMARY KEY,
    day VARCHAR(255)
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    waiter_id INT,
    day_id INT,
    available BOOLEAN,
    FOREIGN KEY (waiter_id) REFERENCES waiters(id),
    FOREIGN KEY (day_id) REFERENCES day_of_the_week(id)
);