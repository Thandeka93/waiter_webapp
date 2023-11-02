// Export a function that creates a set of database queries
export default function createDatabaseQueries(db) {

  // Function to update a waiter's schedule
  async function updateWaiterAvailability(waiterName, dayOfTheWeek) {
    try {
      // Insert the waiter's name only if it doesn't already exist in the database
      await db.none('INSERT INTO waiters (waiter_name) VALUES ($1) ON CONFLICT (waiter_name) DO NOTHING', [waiterName]);
      // Get the waiter's ID
      const waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);

      // Retrieve the existing schedule for the waiter
      var available = await db.manyOrNone('SELECT day_id FROM schedule WHERE waiter_id = $1', [waiterId.id]);

      // Delete the existing schedule if it exists
      if (available) {
        await db.none('DELETE FROM schedule WHERE waiter_id = $1', [waiterId.id]);
      }

      // Insert a new schedule for the selected days
      for (var i = 0; i < dayOfTheWeek.length; i++) {
        // Check if at least 3 days are selected, otherwise, throw an error
        if (dayOfTheWeek.length < 3) {
          throw new Error('Please select at least 3 days');
        }

        let anyDay = dayOfTheWeek[i];

        // Get the ID for the selected day
        let dayId = await db.one('SELECT id FROM day_of_the_week WHERE day = $1', [anyDay]);

        // Insert the waiter name and day availability into the schedule
        await db.none('INSERT INTO schedule (waiter_id, day_id) VALUES ($1, $2)', [waiterId.id, dayId.id]);
      }
    }
    catch (error) {
      console.error(error.message);
    }
  }

  // Function to get the schedule of a specific waiter
  async function getWaiterAvailability(waiterName) {
    try {
      // Join the three tables to retrieve all inserted values for the specified waiter
      let waiterSchedule = await db.manyOrNone('SELECT waiters.waiter_name, day_of_the_week.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN day_of_the_week ON schedule.day_id = day_of_the_week.id WHERE waiters.waiter_name = $1', [waiterName]);
      return waiterSchedule;
    }
    catch (error) {
      console.error(error.message);
    }
  }

  // Function to get all waiter schedules
  async function getAllWaiterAvailabilities() {
    try {
      // Join all the tables to retrieve all the schedules
      let allWaiterSchedules = await db.manyOrNone('SELECT waiters.waiter_name, day_of_the_week.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN day_of_the_week ON schedule.day_id = day_of_the_week.id');
      return allWaiterSchedules;
    }
    catch (error) {
      console.error(error.message);
    }
  }

  // Function to get the schedule by day, showing the number of waiters available for each day
  async function countWaitersByDay() {
    // Fetch all schedules from the database
    const allSchedules = await getAllWaiterAvailabilities();
    const scheduleByDay = {};

    for (const schedule of allSchedules) {
      // Assign the day and waiter_name as the object keys for the schedule
      const { day, waiter_name } = schedule;

      if (!scheduleByDay[day]) {
        scheduleByDay[day] = { waiters: [], count: 0 };
      }

      // Check if the waiter already exists in the schedule for that day
      const waiterExists = scheduleByDay[day].waiters.includes(waiter_name);

      if (!waiterExists) {
        scheduleByDay[day].waiters.push(waiter_name);
        scheduleByDay[day].count++;
      }
    }

    for (const day in scheduleByDay) {
      // Log the day and the number of waiters available
      console.log(`Day: ${day}, Number of Waiters: ${scheduleByDay[day].count}`);
    }

    return scheduleByDay;
  }

  // Function to reset the database, deleting all schedules and waiters
  async function resetDatabase() {
    try {
      // Delete all schedules
      await db.none('DELETE FROM schedule');

      // Delete all waiters
      await db.none('DELETE FROM waiters');
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to get the days of the week from the database
  async function retrieveWeekdays() {
    try {
      const days = await db.manyOrNone('SELECT day FROM day_of_the_week');
      return days;
    } catch (error) {
      console.error(error.message);
    }
  }
  

  return {
    updateWaiterAvailability,
    getAllWaiterAvailabilities,
    countWaitersByDay,
    getWaiterAvailability,
    resetDatabase,
    retrieveWeekdays
  };
}





