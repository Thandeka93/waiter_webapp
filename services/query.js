// Define a module for managing waiters app with a database connection
function waiter(db) {
  
  // Function to update a waiter's schedule
  async function updateSchedule(waiterName, dayOfTheWeek) {
    try {
      // Insert the waiter's name if it doesn't exist
      await db.none('INSERT INTO waiters (waiter_name) VALUES ($1) ON CONFLICT (waiter_name) DO NOTHING', [waiterName]);

      // Get the waiter's ID
      const waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);

      // Get the existing schedule
      var available = await db.manyOrNone('SELECT day_id FROM admin_table WHERE waiter_id = $1', [waiterId.id]);

      // Delete the existing schedule
      if (available) {
        await db.none('DELETE FROM admin_table WHERE waiter_id = $1', [waiterId.id]);
      }

      // Insert a new schedule
      for (var i = 0; i < dayOfTheWeek.length; i++) {
        if (dayOfTheWeek.length < 3) {
          throw new Error('Please choose at least 3 days');
        }

        let anyDay = dayOfTheWeek[i];

        // Get the ID for the selected day
        let dayId = await db.one('SELECT id FROM weekdays WHERE day = $1', [anyDay]);

        // Insert waiter name and day availability
        await db.none('INSERT INTO admin_table (waiter_id, day_id) VALUES ($1, $2)', [waiterId.id, dayId.id]);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to get a waiter's schedule
  async function getWaiterSchedule(waiterName) {
    try {
      // Join three tables to get all inserted values
      let waiterSchedule = await db.manyOrNone('SELECT waiters.waiter_name, weekdays.day FROM waiters JOIN admin_table ON waiters.id = admin_table.waiter_id JOIN weekdays ON admin_table.day_id = weekdays.id WHERE waiters.waiter_name = $1', [waiterName]);
      return waiterSchedule;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to get all schedules
  async function getAllSchedules() {
    // Join all the tables to return all the schedules
    try {
      let allWaiterSchedules = await db.manyOrNone('SELECT waiters.waiter_name, weekdays.day FROM waiters JOIN admin_table ON waiters.id = admin_table.waiter_id JOIN weekdays ON admin_table.day_id = weekdays.id');
      return allWaiterSchedules;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to get schedules by day
  async function getScheduleByDay() {
    // Fetch schedules from the database
    const allSchedules = await getAllSchedules();
    const scheduleByDay = {};

    for (const schedule of allSchedules) {
      // Assign the day and waiter_name as object keys for the schedule
      const { day, waiter_name } = schedule;

      if (!scheduleByDay[day]) {
        scheduleByDay[day] = { waiters: [], count: 0 };
      }

      const waiterExists = scheduleByDay[day].waiters.includes(waiter_name);

      if (!waiterExists) {
        scheduleByDay[day].waiters.push(waiter_name);
        scheduleByDay[day].count++;
      }
    }

    return scheduleByDay;
  }

  // Function to reset all data
  async function reset() {
    try {
      // Delete all schedules
      await db.none('DELETE FROM admin_table');

      // Delete all waiters
      await db.none('DELETE FROM waiters');
    } catch (error) {
      console.error(error.message);
    }
  }

  // Export public functions
  return {
    updateSchedule,
    getAllSchedules,
    getScheduleByDay,
    getWaiterSchedule,
    reset
  };
}

// Export the waiter module
export default waiter;









