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
            await query.reset();
        } catch (err) {
            console.log(err);
        }
    });

    it('waiter name and avalability', async function () {
        try{
            var waiterName = 'Tee'
        var dayOfTheWeek = ['Monday', 'Tuesday']

        const insert = await query.updateSchedule(waiterName,dayOfTheWeek);

        assert.deepEqual(insert, 'Tee'['Monday', 'Tuesday']);
        }catch(error){
            console.error(error.message)
           }
        
    });

    it('error handling', async function(){
        this.timeout(10000); 
        try{
            var waiterName = 'Ted';
            var dayOfTheWeek = ['Monday'];
        
            await query.updateSchedule(waiterName,dayOfTheWeek);
            
        var schedule = await query.getWaiterSchedule(waiterName)
        assert.deepEqual(schedule, []);
        }catch(error){
            assert.equal(error.message,'Please choose at least 3 days');
        }

        try{
            var waiterName = 'Thabo';
            var dayOfTheWeek = [''];
        
            await query.updateSchedule(waiterName,dayOfTheWeek);
            
        var schedule = await query.getWaiterSchedule(waiterName)
        assert.deepEqual(schedule, []);
        }catch(error){
            assert.equal(error.message,'Please choose at least 3 days');
        }

    
    });

    it('should return all waiter schedules', async function () {
        this.timeout(10000); 
        // Add schedules for waiters
        await query.updateSchedule('John', ['Monday', 'Tuesday', 'Wednesday']);
        await query.updateSchedule('Alice', ['Thursday', 'Friday', 'Saturday']);
        await query.updateSchedule('Bob', ['Sunday', 'Monday', 'Tuesday']);
    
        const allSchedules = await query.getAllSchedules();
    
        // Check if allSchedules is not null and has a length greater than 0
        assert.equal(allSchedules !== null && allSchedules.length > 0, true);
    });

    after(function () {
        db.$pool.end;
    });

});







