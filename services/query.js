export default function createDatabaseQueries(db) {
  // Function to record a day
  async function insertDay(dayID, day) {
    try {
      // Insert a day into the 'days' table
      await db.none(`INSERT INTO days(dayID, day) VALUES ($1, $2)`, [dayID, day]);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to record a waiter
  async function insertWaiter(name) {
    try {
        // Insert a waiter into the 'waiters' table with a default ID
        await db.none(`INSERT INTO waiters(waiterID, name) VALUES (DEFAULT, $1)`, name);
    } catch (error) {
        console.error(error);
    }
}

  // Function to retrieve admin data
  async function getAdminData() {
    try {
      // Retrieve waiter names and corresponding days from the database
      let result = await db.manyOrNone(`SELECT waiters.name, days.day FROM admin JOIN days ON admin.dayID = days.dayID JOIN waiters ON admin.waiterID = waiters.waiterID`);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // Function to reset the admin table
  async function resetAdminTable() {
    try {
      // Delete all records from the 'admin' table
      await db.none(`DELETE FROM admin`);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to set an admin entry
  async function setAdminEntry(dayID, waiterID) {
    try {
      // Insert an admin entry into the 'admin' table
      await db.none("INSERT INTO admin(dayID, waiterID) VALUES ($1, $2)", [dayID, waiterID]);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to update admin data
  async function updateAdmin(waiterID) {
    try {
      // Delete an admin entry by waiter ID
      await db.none("DELETE FROM admin WHERE waiterID = $1", waiterID);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to retrieve a waiter by name
  async function getWaiterByName(name) {
    try {
      // Retrieve a waiter by their name
      let result = await db.oneOrNone("SELECT name FROM waiters WHERE name = $1", name);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // Function to retrieve the days assigned to a waiter
  async function getWaiterDaysAssigned(name) {
    if (name) {
      try {
        // Retrieve the day IDs assigned to a waiter by name
        let result = await db.manyOrNone("SELECT dayID FROM admin JOIN waiters ON admin.waiterID = waiters.waiterID WHERE name = $1", name);
        return result;
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Function to update the schedule for a waiter
  async function updateWaiterSchedule(waiterID, dayToRemove, dayToAdd) {
    try {
      // Delete the existing assignment and insert a new one for a waiter
      await db.none("DELETE FROM admin WHERE waiterID = $1 AND dayID = $2", [waiterID, dayToRemove]);
      console.log("Successfully deleted the assignment");
      await db.none("INSERT INTO admin(dayID, waiterID) VALUES ($1, $2)", [dayToAdd, waiterID]);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to delete a waiter's assignment
  async function deleteWaiterAssignment(waiterID, dayID) {
    try {
      // Delete a waiter's assignment for a specific day
      await db.none("DELETE FROM admin WHERE waiterID = $1 AND dayID = $2", [waiterID, dayID]);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to get a waiter's ID by name
  async function getWaiterIDByName(name) {
    try {
      // Retrieve a waiter's ID by their name
      let result = await db.oneOrNone("SELECT waiterID FROM waiters WHERE name = $1", name);
  
      if (result) {
        let waiterID = result.waiterid;
        return waiterID;
      } else {
        // Handle the case where no waiter with the given name was found
        return null; 
      }
    } catch (error) {
      console.error(error);
      // Handle the database error appropriately
      throw error; 
    }
  }
  

  // async function getWaiterIDByName(name) {
  //   try {
  //     // Retrieve a waiter's ID by their name
  //     let result = await db.oneOrNone("SELECT waiterID FROM waiters WHERE name = $1", name);
  //     let waiterID = result.waiterid;
  //     return waiterID;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // Function to get the days assigned to a waiter by ID
  async function getDaysAssignedToWaiter(waiterID) {
    try {
      // Retrieve the day IDs assigned to a waiter by their ID
      let result = await db.manyOrNone("SELECT dayID FROM admin WHERE waiterID = $1", waiterID);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // Return all the functions as an object
  return {
    resetAdminTable,
    insertDay,
    insertWaiter,
    getAdminData,
    updateAdmin,
    setAdminEntry,
    getWaiterByName,
    updateWaiterSchedule,
    getWaiterIDByName,
    deleteWaiterAssignment,
    getDaysAssignedToWaiter,
    getWaiterDaysAssigned
  };
}
