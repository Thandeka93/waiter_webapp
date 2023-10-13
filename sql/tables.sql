CREATE TABLE days(
    dayID INT PRIMARY KEY,
    day VARCHAR(255)
    );

-- CREATE TABLE waiters(
--     waiterID SERIAL PRIMARY KEY,
--     name VARCHAR(255)
--     );

CREATE TABLE waiters (
    waiterid SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE admin(
    dayID INT,
    waiterID INT, 
    FOREIGN KEY(dayID) REFERENCES days(dayID), 
    FOREIGN KEY(waiterID) REFERENCES waiters(waiterID)
    );

-- waiterID INT PRIMARY KEY,
