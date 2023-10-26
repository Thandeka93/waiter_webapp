// Define a function 'createDatabaseQueries' that takes a 'db' object as a parameter
export default function createDatabaseQueries(db) {

  // Define an async function 'insertDayRecord' to insert a new day record in the database
  async function insertDayRecord(id, day) {
    try {
      await db.none(`INSERT INTO days(dayID, day) VALUES ($1, $2)`, [id, day]);
    } catch (err) {
      console.log(err);
    }
  }

  // Define an async function 'insertWaiterRecord' to insert a new waiter record in the database
  async function insertWaiterRecord(waiter) {
    try {
      await db.none(`INSERT INTO waiters(name) VALUES ($1)`, waiter);
    } catch (err) {
      console.log(err);
    }
  }

  // Define an async function 'getAdminSchedule' to retrieve admin schedule data from the database
  async function getAdminSchedule() {
    try {
      let result = await db.manyOrNone(
        `SELECT waiters.name, days.day FROM admin
         JOIN days ON admin.dayID = days.dayID
         JOIN waiters ON admin.waiterID = waiters.waiterID`
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // Define an async function 'clearAdminSchedule' to clear the admin schedule by deleting all records
  async function clearAdminSchedule() {
    try {
      await db.none(`DELETE FROM admin`);
    } catch (err) {
      console.log(err);
    }
  }

  // Define an async function 'assignWaiterToDay' to assign a waiter to a specific day in the admin schedule
  async function assignWaiterToDay(dayID, waiterID) {
    try {
      await db.none("INSERT INTO admin(dayID, waiterID) VALUES ($1, $2)", [dayID, waiterID]);
    } catch (err) {
      console.log(err);
    }
  }

  // Define an async function 'removeWaiterFromAdmin' to remove a waiter from the admin schedule
  async function removeWaiterFromAdmin(waiterID) {
    try {
      await db.none("DELETE FROM admin WHERE waiterID = $1", waiterID);
    } catch (err) {
      console.log(err);
    }
  }


  // Define an async function 'getWaiterByName' to retrieve a waiter by name
  async function getWaiterByName(waiter) {
    try {
      let result = await db.oneOrNone("SELECT name FROM waiters WHERE name = $1", waiter);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  // Define an async function 'getWaiterDaysAssigned' to retrieve the days a waiter is assigned to
  async function getWaiterDaysAssigned(name) {
    if (name) {
      try {
        let result = await db.manyOrNone(
          "SELECT dayID FROM admin JOIN waiters ON admin.waiterID = waiters.waiterID WHERE name = $1",
          name
        );
        return result;
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Define an async function 'getWaiterIDByName' to retrieve a waiter's ID by name
  async function getWaiterIDByName(name) {
    try {
      const result = await db.one("SELECT waiterID FROM waiters WHERE name = $1", name);
      return result.waiterid; // Make sure to use the correct property name
    } catch (err) {
      if (err.name === 'QueryResultError' && err.code === 0) {
        // Handle the case when no result is found (QueryResultError with code 0)
        return null; // or some other appropriate value
      } else {
        console.log(err);
        throw err; // Rethrow other errors for debugging purposes
      }
    }
  }

  // Define an async function 'getDaysAssignedToWaiter' to retrieve the days assigned to a waiter
  async function getDaysAssignedToWaiter(waiterID) {
    try {
      let result = await db.manyOrNone("SELECT dayID FROM admin WHERE waiterID = $1", waiterID);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteWaiter(waiterID, dayID) {
    try {
      await db.none("DELETE FROM admin WHERE waiterID=$1 AND dayID=$2", [waiterID, dayID]);
    } catch (err) {
      console.log(err);
    }
  }

  async function getDays(){
    return await db.manyOrNone("SELECT day FROM days");
  }

   // Define an async function 'getDaysOfWeek' to retrieve the days of the week from the database
   async function getDaysOfWeek() {
    try {
      const days = await db.manyOrNone("SELECT day, dayID FROM days");
      return days;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  // Return an object with the defined functions as properties
  return {
    clearAdminSchedule,
    insertDayRecord,
    insertWaiterRecord,
    getAdminSchedule,
    removeWaiterFromAdmin,
    assignWaiterToDay,
    getWaiterByName,
    getWaiterIDByName,
    getDaysAssignedToWaiter,
    getWaiterDaysAssigned,
    deleteWaiter,
    getDays,
    getDaysOfWeek
  };
}






