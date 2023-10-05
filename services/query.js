import db from '../db.js';

// Define and export the waiterService function
export default function waiterService() {
  
  // Function to insert a waiter into the 'waiters' table
  const insertWaiter = async (waiterName) => {
    try {
      // Execute SQL query to insert waiter
      await db.none('INSERT INTO waiters (waiter_name) VALUES ($1)', [waiterName]);
    } catch (error) {
      // Handle and log errors
      console.error('Error inserting waiter:', error.message);
    }
  };

  // Function to update waiter availability
  const updateWaiterAvailability = async (waiterName, dayOfTheWeek) => {
    try {
      // Get the waiter_id based on waiterName
      const waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);
      
      if (waiterId) {
        // Use waiterId to update availability in the schedule table
        for (const day of dayOfTheWeek) {
          // Execute SQL query to get dayId for the selected day
          const dayId = await db.oneOrNone('SELECT id FROM weekdays WHERE day = $1', [day]);
          
          if (dayId) {
            // Execute SQL query to insert or update availability in the schedule table
            await db.none('INSERT INTO schedule (waiter_id, day_id, available) VALUES ($1, $2, $3) ON CONFLICT (waiter_id, day_id) DO UPDATE SET available = EXCLUDED.available', [waiterId.id, dayId.id, true]);
          } else {
            console.error('No day found with the name', day);
          }
        }
      } else {
        console.error('No waiter found with the name', waiterName);
      }
    } catch (error) {
      console.error('Error updating waiter availability:', error.message);
    }
  };
  
//   const updateWaiterAvailability = async (waiterName, dayOfTheWeek) => {
//     try {
//       // Execute SQL query to get all days associated with waiterName
//       const allDays = await db.manyOrNone('SELECT day FROM weekdays WHERE waiter_name = $1', [waiterName]);
      
//       // Filter days that are not in dayOfTheWeek
//       for (const day of allDays) {
//         if (!dayOfTheWeek.includes(day)) {
//           // Execute SQL queries to delete unavailable shifts
//           const dayId = await db.oneOrNone('SELECT id FROM weekdays WHERE day = $1', [day]);
//           const waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);
//           await db.none('DELETE FROM schedule WHERE waiter_id = $1 AND day_id = $2', [waiterId.id, dayId.id]);
//         }
//       }

//       // Loop through selected days to update availability
//       for (const day of dayOfTheWeek) {
//         // Execute SQL query to get dayId for the selected day
//         const dayId = await db.oneOrNone('SELECT id FROM weekdays WHERE day = $1', [day]);
        
//         // Check if dayId is null (no day found with the name)
//         if (dayId === null) {
//           console.error('No day found with the name', day);
//           continue; // Skip this iteration
//         }
        
//         // Execute SQL query to get waiterId
//         const waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);
        
//         // Execute SQL query to insert availability into 'schedule' table
//         await db.none('INSERT INTO schedule (waiter_id, day_id, available) VALUES ($1, $2, $3) ON CONFLICT (waiter_id, day_id) DO NOTHING', [waiterId.id, dayId.id, true]);
//       }
//     } catch (error) {
//       // Handle and log errors
//       console.error('Error updating waiter availability:', error.message);
//     }
//   };

  // Function to get a waiter's schedule
  const getWaiterSchedule = async (waiterName) => {
    try {
      // Execute SQL query to fetch waiter's schedule
      const waiterSchedule = await db.manyOrNone('SELECT waiters.waiter_name, weekdays.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN weekdays ON schedule.day_id = weekdays.id WHERE waiters.waiter_name = $1', [waiterName]);
      return waiterSchedule || []; // Return the schedule or an empty array if no data
    } catch (error) {
      // Handle and log errors
      console.error('Error fetching waiter schedule:', error.message);
    }
  };

  // Function to get all waiter schedules
  const getAllSchedules = async () => {
    try {
      // Execute SQL query to fetch all waiter schedules
      const allWaiterSchedules = await db.manyOrNone('SELECT waiters.waiter_name, weekdays.day FROM waiters JOIN schedule ON waiters.id = schedule.waiter_id JOIN weekdays ON schedule.day_id = weekdays.id');
      return allWaiterSchedules; // Return the schedules
    } catch (error) {
      // Handle and log errors
      console.error('Error fetching all schedules:', error.message);
    }
  };

  // Function to count available waiters for a given day
  const countAvailableWaiters = async (dayOfTheWeek) => {
    try {
      // Execute SQL query to count available waiters for the given day
      const waiterCount = await db.manyOrNone('SELECT COUNT(waiter_id) FROM schedule WHERE day_id = $1', [dayOfTheWeek]);
      return waiterCount; // Return the waiter count
    } catch (error) {
      // Handle and log errors
      console.error('Error counting available waiters:', error.message);
    }
  };

  // Function to cancel all shifts for a waiter
  const cancelAll = async (waiterName) => {
    try {
      // Execute SQL query to get waiterId
      const waiterId = await db.oneOrNone('SELECT id FROM waiters WHERE waiter_name = $1', [waiterName]);
      
      // Execute SQL query to delete all shifts for the waiter
      await db.none('DELETE FROM schedule WHERE waiter_id = $1', [waiterId.id]);
    } catch (error) {
      // Handle and log errors
      console.error('Error canceling all shifts:', error.message);
    }
  };

  // Return an object containing all the defined functions
  return {
    insertWaiter,
    updateWaiterAvailability,
    getWaiterSchedule,
    getAllSchedules,
    countAvailableWaiters,
    cancelAll,
  };
}



