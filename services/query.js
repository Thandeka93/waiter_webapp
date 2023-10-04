// Define a function called 'waiter' that takes a 'db' parameter
function waiterService(db) {

    // Define an async function 'setWaiterName' that sets the waiter's name
    async function setWaiterName(waiterName) {
        try {
            // Insert a waiter into the waiter table
            await db.none('INSERT INTO waiters (waiter_name) VALUES ($1)', [waiterName]);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    // Define an async function 'waiters' that updates waiter availability
    async function waiters(waiterName, dayOfTheWeek) {
        try {
            // Get the waiter's ID

            // Get all days for the waiter
            let allDays = await db.manyOrNone('SELECT day FROM weekdays WHERE waiter_name = $1', [waiterName]);

            // Find the days to be deleted
            let daysToDelete = allDays.filter(day => !dayOfTheWeek.includes(day));

            // Delete the unchecked days from the schedule
            for (let day of daysToDelete) {
                let dayId = await db.oneOrNone('SELECT id FROM weekdays WHERE day = $1', [day]);
                let waiterId = await db.oneOrNone('SELECT id FROM weekdays WHERE day = $1', [day]);
                await db.none('DELETE FROM schedule WHERE waiter_id = $1 AND day_id = $2', [waiterId.id, dayId.id]);
            }

            // Update availability for each checked day and insert waiter ID and day ID into the scheduling table
            for (let day of dayOfTheWeek) {
                let dayId = await db.oneOrNone('SELECT id FROM weekdays WHERE day = $1', [day]);
                if (dayId === null) {
                    console.error('No day found with the name', day);
                    continue; // Skip this iteration of the loop
                }
                let waiterId = await db.oneOrNone('SELECT id FROM waiter_id WHERE day = $1', [waiterName]);

                await db.none('INSERT INTO schedule (waiter_id, day_id, available) VALUES ($1, $2, $3) ON CONFLICT (waiter_id, day_id) DO NOTHING', [waiterId.id, dayId.id, true]);
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }

    // Define an async function 'getWaiterSchedule' that retrieves a waiter's schedule
    async function getWaiterSchedule(waiterName) {
        try {
            // Join the three tables to get all inserted values
            let waiterSchedule = await db.manyOrNone('SELECT waiters.waiter_name, weekdays.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN weekdays ON schedule.day_id = weekdays.id WHERE waiters.waiter_name = $1', [waiterName]);
            return waiterSchedule || [];
        }
        catch (error) {
            console.error(error.message);
        }
    }

    // Define an async function 'getAllSchedules' that retrieves all waiter schedules
    async function getAllSchedules() {
        try {
            let allWaiterSchedules = await db.manyOrNone('SELECT waiters.waiter_name, weekdays.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN weekdays ON schedule.day_id = weekdays.id');
            return allWaiterSchedules;
        }
        catch (error) {
            console.error(error.message);
        }
    }

    // Define an async function 'countAvailableWaiters' that counts available waiters for a given day
    async function countAvailableWaiters(dayOfTheWeek) {
        try {
            let waiterCount = await db.manyOrNone('SELECT COUNT(waiter_id) FROM schedule WHERE day_id = $1', [dayOfTheWeek]);
            return waiterCount;
        } catch (error) {
            console.error(error.message);
        }
    }

    // Define an async function 'cancelAll' that cancels all available shifts for a waiter
    async function cancelAll(waiterName) {
        try {
            // Get waiter ID
            let waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);
            // Delete all the available days from the schedule table
            await db.none('DELETE FROM schedule WHERE waiter_id = $1', [waiterId.id]);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    // Return an object containing all the defined functions
    return {
        setWaiterName,
        waiters,
        getAllSchedules,
        getWaiterSchedule,
        countAvailableWaiters,
        cancelAll
    };
}

// Export the 'waiter' function as the default export
export default waiterService;

