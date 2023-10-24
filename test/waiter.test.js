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

    it('should return the total number of the waiters in the database', async function(){
 	
        let waiters= await query.getAdmin();
              assert.equal(0,waiters);
       });

       
       
    

    after(function () {
        db.$pool.end;
    });

});







