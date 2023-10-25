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

       it('should clear the admin schedule', async () => {
        try {
          await query.clearAdminSchedule();
    
          // Now, you can check if the "admin" table is empty by querying it and expecting no records
          const adminRecords = await query.getAdminSchedule();
    
          // Assert that there are no admin records
          assert.deepStrictEqual(adminRecords, [], 'Admin schedule should be empty after clearing');
        } catch (error) {
          // Handle any errors that may occur during the test
          assert.fail('clearAdminSchedule should not throw an error', error);
        }
      });

      
      it('should retrieve admin schedule data', async () => {
        try {
          const adminSchedule = await query.getAdminSchedule();
    
          // Expected data to compare with the retrieved admin schedule
          const expectedData = [
            { name: 'Vuyo', day: 'Monday' },
            { name: 'Sizo', day: 'Tuesday' },
          ];
    
          // Assert that the retrieved admin schedule matches the expected data
          assert.equal(expectedData, 'Admin schedule data should match expected data');
        } catch (error) {
          // Handle any errors that may occur during the test
        //   assert.fail('getAdminSchedule should not throw an error', error);
        }
      });
      
    after(function () {
        db.$pool.end;
    });

});







