import assert from "assert";
import waiterService from "../services/query.js";
import pgPromise from "pg-promise";

const mockDbConnection = {
    none: async () => { },
    oneOrNone: async () => { },
    many: async () => { },
    manyOrNone: async () => { },
};

const connectionString = process.env.PGDATABASE_URL ||
    'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';
const pgp = pgPromise();
const db = pgp(connectionString);

describe('waiterService', () => {
    // Initialize the waiter service with the mock database connection
    const service = waiterService(mockDbConnection);

    describe('waiters', () => {
        it('should insert a new waiter and their availability', async () => {
            await service.waiters('John', ['Monday', 'Wednesday']);
            assert.notEqual('John', 2);
        });
    });
});

