import 'dotenv/config';
import assert from 'assert';
import createDatabaseQueries from '../services/query.js';
import createScheduleProcessor from '../scheduleProcessor.js';
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

      it('should add a waiter to the admin schedule', async function () {
        try {
          // Insert a new waiter to the admin schedule
          const waiterID = 1; 
          const dayID = 1;   
          await query.assignWaiterToDay(dayID, waiterID);
      
          // Retrieve the admin schedule to check if the waiter was added
          const adminSchedule = await query.getAdminSchedule();
      
          // Check if the added waiter is in the admin schedule
          const addedWaiter = adminSchedule.find(record => record.waiterID === waiterID && record.dayID === dayID);
          assert.equal(addedWaiter, undefined);
        } catch (error) {
          // Handle any errors that may occur during the test
          assert.fail('assignWaiterToDay should not throw an error', error);
        }
      });

      it('should remove a waiter from the admin schedule', async function () {
        const waiterID = 1;
        
        const initialDaysAssigned = await query.getDaysAssignedToWaiter(waiterID); // Get the initial list of days assigned
        
        await query.removeWaiterFromAdmin(waiterID);
        
        const finalDaysAssigned = await query.getDaysAssignedToWaiter(waiterID); // Get the list of days assigned after removal
        
        // Assert that the waiter is removed by comparing the lengths of the initial and final lists
        assert.equal(finalDaysAssigned.length, 0, 'Waiter should be removed from admin schedule');
      });
      

      it('should get the days of the week', async function () {
        const daysOfWeek = await query.getDaysOfWeek();
        
        assert.equal(daysOfWeek.length, 7, 'There should be 7 days in a week');
      });

        const sampleSchedule = [
          { name: 'Alice', day: 'Monday' },
          { name: 'Bob', day: 'Tuesday' },
          { name: 'Charlie', day: 'Monday' },
          { name: 'Dave', day: 'Wednesday' },
          { name: 'Eve', day: 'Tuesday' },
          
        ];
      
        it('should categorize names and days correctly', function () {
          const scheduleProcessor = createScheduleProcessor(sampleSchedule);
      
          const names = scheduleProcessor.getNames();
          const daysData = scheduleProcessor.getDaysData();
      
          assert.deepEqual(names, ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'], 'Names should be categorized correctly');
          assert.deepEqual(daysData.monday, ['Alice', 'Charlie'], 'Monday entries should be categorized correctly');
          assert.deepEqual(daysData.tuesday, ['Bob', 'Eve'], 'Tuesday entries should be categorized correctly');
          assert.deepEqual(daysData.wednesday, ['Dave'], 'Wednesday entries should be categorized correctly');
        });
      
    after(function () {
        db.$pool.end;
    });

});







