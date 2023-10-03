import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
dotenv.config();

const pgp = pgPromise();

// for SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// db connection 
const connectionString = process.env.PGDATABASE_URL || 'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe'

const db = pgp(connectionString);
db.connect();

export default db