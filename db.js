import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();

// For SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

// DB connection
const connectionString = process.env.PGDATABASE_URL || 'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';

const db = pgp(connectionString);

// You don't need to call db.connect() explicitly in newer versions of pg-promise

export default db;
