import assert from "assert";
import waiterService from "../services/query.js";
import pgPromise from "pg-promise"; 

const connectionString = process.env.PGDATABASE_URL || 
'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';
const pgp = pgPromise();
const db = pgp(connectionString);

// Initialize the waiter service with the database connection
const service = waiterService(db);

// Test the waiters function
describe('waiters', () => {
    it('should add a waiter and their schedule', async () => {
      const waiterName = 'John';
      const dayOfTheWeek = ['Monday', 'Tuesday'];
  
      // Call the waiters function
      await service.waiters(waiterName, dayOfTheWeek);
  
      // Query the database to check if the waiter and schedule were added
      const waiterSchedule = await service.getWaiterSchedule(waiterName);
  
      // Assert that the waiter and schedule were added correctly
      assert.equal(waiterSchedule.length, 2); // Check the number of scheduled days
    });
  });

  