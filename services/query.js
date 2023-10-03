// Define a function 'waiter' that takes a 'db' object as a parameter:
function waiterService(db) {

    // Define an inner async function 'waiters' that takes 'waiterName' and 'dayOfTheWeek' as parameters:
    async function waiters(waiterName, dayOfTheWeek) {
        try {
            // Insert a new waiter with 'waiterName' into the 'waiters' table
            await db.none('INSERT INTO waiters (waiter_name) VALUES ($1)', [waiterName]);

            // Get the 'id' of the inserted waiter
            let waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);

            // Update availability for each day and insert to the 'schedule' table
            for (let day of dayOfTheWeek) {
                // Get the 'id' of the 'day' from the 'day_of_the_week' table
                let dayId = await db.oneOrNone('SELECT id FROM day_of_the_week WHERE day = $1', [day]);

                // Insert a record into the 'schedule' table with 'waiter_id', 'day_id', and 'available' set to true
                await db.none('INSERT INTO schedule (waiter_id,day_id, available) VALUES ($1,$2, $3)', [waiterId.id, dayId.id, true]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // Define an inner async function 'getWaiterSchedule' that takes 'waiterName' as a parameter:
    async function getWaiterSchedule(waiterName) {
        try {
            // Join the three tables to get all inserted values
            let waiterSchedule = await db.many('SELECT waiters.waiter_name, day_of_the_week.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN day_of_the_week ON schedule.day_id = day_of_the_week.id WHERE waiters.waiter_name = $1', [waiterName]);
            return waiterSchedule;
        } catch (error) {
            console.error(error.message);
        }
    }

    // Define an inner async function 'getAllSchedules':
    async function getAllSchedules() {
        try {
            // Retrieve all waiter schedules from the database (query not specified in the code)
            let allWaiterSchedules = await db.manyOrNone('');
            return allWaiterSchedules;
        } catch (error) {
            console.error(error.message);
        }
    }

    // Define an inner async function 'countAvailableWaiters':
    async function countAvailableWaiters() {
        // This function is empty and should be implemented to count available waiters per day based on your business logic.
    }

    // Define an inner async function 'cancel' that takes 'waiterName' and 'day' as parameters:
    async function cancel(waiterName, day) {
        try {
            // Get the 'id' of the waiter with 'waiterName'
            let waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);

            // Get the 'id' of the 'day' from the 'day_of_the_week' table
            let dayId = await db.oneOrNone('SELECT id FROM day_of_the_week WHERE day = $1', [day]);

            // Delete the record from the 'schedule' table where 'waiter_id' matches the waiter's 'id' and 'day_id' matches the 'day' 'id'
            await db.none('DELETE FROM schedule WHERE waiter_id = $1 AND day_id = $2', [waiterId.id, dayId.id]);
        } catch (error) {
            console.error(error.message);
        }
    }

    // Return an object with functions as properties:
    return {
        waiters,
        getAllSchedules,
        getWaiterSchedule,
        countAvailableWaiters,
        cancel
    };
}

// Export the 'waiter' function as the default export
export default waiterService;
