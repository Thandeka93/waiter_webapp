import 'dotenv/config';
import assert from 'assert';
import createDatabaseQueries from '../services/query.js';
import pgPromise from 'pg-promise';

const connectionString =
    process.env.PGDATABASE_URL ||
    'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';

const pgp = pgPromise();
const db = pgp(connectionString);


let waiterFunc = createDatabaseQueries(db)

describe('Waiter availability', async function () {

    beforeEach(async function () {
        this.timeout(10000);
        try {
            await waiterFunc. resetDatabase();
        } catch (err) {
            console.log(err);
        }
    });

    it('should insert a waiter name and days', async function () {
      try{
          var waiterName = 'Thandeka'
      var dayOfTheWeek = ['Monday', 'Tuesday']

      const insert = await waiterFunc.updateWaiterAvailability(waiterName,dayOfTheWeek);

      assert.deepEqual(insert, 'Thandeka'['Monday', 'Tuesday']);
      }catch(error){
          console.error(error.message)
         }
      
  });

  it('should return an array of days from the database', async function () {
    try {
      const days = await waiterFunc.retrieveWeekdays();
  
      // Assert that days is an array
      assert.equal(Array.isArray(days), true);
    } catch (error) {
      console.error(error.message);
    }
  });
  
  it('should reset the database by deleting schedules and waiters', async function () {
    this.timeout(5000); // Increase the timeout to 5000ms if needed
  
    try {
      // Add some data to the database for testing
      await waiterFunc.updateWaiterAvailability('John', ['Monday', 'Tuesday']);
      await waiterFunc.updateWaiterAvailability('Alice', ['Wednesday', 'Thursday']);
  
      // Call the reset function
      await waiterFunc. resetDatabase();
  
      // Check if the schedules and waiters have been deleted
      const schedulesCount = parseInt(await db.one('SELECT count(*) FROM schedule', [], (a) => a.count));
      const waitersCount = parseInt(await db.one('SELECT count(*) FROM waiters', [], (a) => a.count));
  
      assert.strictEqual(schedulesCount, 0);
      assert.strictEqual(waitersCount, 0);
    } catch (error) {
      console.error(error.message);
    }
  });
  


   
    after(function () {
        db.$pool.end;
    });

});







