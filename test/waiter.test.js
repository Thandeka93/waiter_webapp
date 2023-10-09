import assert from "assert";
import pgPromise from "pg-promise";
import createDatabaseQueries from "../services/query.js";

describe('The basic database web app', function () {

    let db;

    before(function () {

        const connectionString =
            process.env.PGDATABASE_URL ||
            'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';

        db = pgPromise()(connectionString);
    });

    after(function () {
        db.$pool.end();
    });

    // it('should test the insert waiter', async function () {
    //     const queryUtility = createDatabaseQueries(db);
    //     const waiterID = 1;
    //     const waiterName = 'Thandeka';

    //     // Insert a waiter into the database
    //     await queryUtility.insertWaiter(waiterID, waiterName);

    //     // Retrieve the inserted waiter from the database
    //     const insertedWaiter = await queryUtility.getWaiterByName(waiterName);

    //     // Assert that the retrieved waiter's name matches the expected value
    //     assert.equal(insertedWaiter.name, waiterName);

    // });



});

