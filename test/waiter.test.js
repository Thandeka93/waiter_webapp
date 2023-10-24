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
        this.timeout(10000);
        try {
            await query.clearAdminSchedule();
        } catch (err) {
            console.log(err);
        }
    });

    it('should return the total number of the waiters in the database', async function(){
 	
        let waiters= await query.getAdminSchedule();
              assert.equal(0,waiters);
       });

       it('should remove a waiter from the admin schedule by waiterID', async () => {
        // Insert a waiter record and an admin record for that waiter
        const waiterID = 1;
        await query.insertWaiterRecord("TestW");
        await query.assignWaiterToDay(1, waiterID); // Assign the waiter to a day
    
        // Use the removeWaiterFromAdmin function to remove the waiter by waiterID
        await query.removeWaiterFromAdmin(waiterID);
    
        // Attempt to retrieve the admin schedule for the waiter by waiterID
        const adminSchedule = await query.getDaysAssignedToWaiter(waiterID);
    
        // Assert that the admin schedule should be empty for the removed waiter
        assert.equal(adminSchedule.length, 0);
      });

      it('should not remove a waiter if the waiterID does not exist in the admin schedule', async () => {
        // Insert a waiter record but do not assign the waiter to the admin schedule
        await query.insertWaiterRecord("AnotherWai");
        const waiterID = 2; // This waiter is not assigned to the admin schedule
    
        // Use the removeWaiterFromAdmin function to attempt to remove the waiter
        await query.removeWaiterFromAdmin(waiterID);
    
        // Attempt to retrieve the admin schedule for the waiter by waiterID
        const adminSchedule = await query.getDaysAssignedToWaiter(waiterID);
    
        // Assert that the admin schedule should be empty for the waiter since they were not assigned
        assert.equal(adminSchedule.length, 0);
      });
      
    after(function () {
        db.$pool.end;
    });

});







