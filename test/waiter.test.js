import 'dotenv/config';
import assert from 'assert';
import createDatabaseQueries from '../services/query.js'
import pgPromise from 'pg-promise';

const connectionString =
    process.env.PGDATABASE_URL ||
    'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';

const pgp = pgPromise();
const db = pgp(connectionString);


let query = createDatabaseQueries(db)

describe('Waiter availability', async function () {

    beforeEach(async function () {
        try {
            await query.resetAdminTable();
        } catch (err) {
            console.log(err);
        }
    });

    it('waiters in the database', async function () {

        let waiters = await query.getAdminData();
        assert.equal(0, waiters.length);
    });

    it('should retrieve days from the database', async () => {
        const days = await query.getDays();
        assert.strictEqual(Array.isArray(days), true);
        assert.strictEqual(days.length, 7);

        // checking the content of the days array
        const expectedDays = [
            { dayid: 1, day: 'Monday' },
            { dayid: 2, day: 'Tuesday' },
            { dayid: 3, day: 'Wednesday' },
            { dayid: 4, day: 'Thursday' },
            { dayid: 5, day: 'Friday' },
            { dayid: 6, day: 'Saturday' },
            { dayid: 7, day: 'Sunday' },
        ];
        assert.deepStrictEqual(days, expectedDays);
    });

    it('should update the admin table by removing a waiter\'s assignments', async () => {
        const waiterName = 'Thandeka'; 
        const waiterID = await query.getWaiterIDByName(waiterName);
    
        // Add an assignment first
        const dayID = 1; 
        await query.setAdminEntry(dayID, waiterID);
    
        // Then, remove the assignment
        await query.updateAdmin(waiterID);
    
        const assignedDays = await query.getWaiterDaysAssigned(waiterName);
    
        assert.strictEqual(assignedDays.includes(dayID), false);
    });

    after(function () {
        db.$pool.end;
    });

});







