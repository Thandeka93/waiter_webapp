// Define a set of functions for interacting with the database
export default function createDatabaseQueries(db) {

  // Function to insert a day into the 'days' table
  const insertDay = async (dayID, day) => {
    await db.none(`INSERT INTO days(dayID, day) VALUES ($1, $2)`, [dayID, day]);
  };

  // Function to insert a waiter into the 'waiters' table
  const insertWaiter = async (name) => {
    await db.none(`INSERT INTO waiters(name) VALUES ($1)`, name);
  };

  // Function to retrieve days from the 'days' table
  const getDays = async () => {
    return db.manyOrNone(`SELECT * FROM days`);
  };


  // Function to retrieve admin data with waiter names and assigned days
  const getAdminData = async () => {
    return db.manyOrNone(`SELECT waiters.name, days.day FROM admin JOIN days ON admin.dayID = days.dayID JOIN waiters ON admin.waiterID = waiters.waiterID`);
  };

  // Function to reset the 'admin' table
  const resetAdminTable = async () => {
    await db.none(`DELETE FROM admin`);
  };

  // Function to set an entry in the 'admin' table for a specific day and waiter
  const setAdminEntry = async (dayID, waiterID) => {
    await db.none("INSERT INTO admin(dayID, waiterID) VALUES ($1, $2)", [dayID, waiterID]);
  };

  // Function to update the 'admin' table by removing a waiter's assignments
  const updateAdmin = async (waiterID) => {
    await db.none("DELETE FROM admin WHERE waiterID = $1", waiterID);
  };

  // Function to retrieve a waiter by their name
  const getWaiterByName = async (name) => {
    return db.oneOrNone("SELECT name FROM waiters WHERE name = $1", name);
  };

  // Function to retrieve the days assigned to a specific waiter
  const getWaiterDaysAssigned = async (name) => {
    if (name) {
      return db.manyOrNone("SELECT dayID FROM admin JOIN waiters ON admin.waiterID = waiters.waiterID WHERE name = $1", name);
    }
  };

  // Function to update a waiter's schedule by removing a day and adding another
  const updateWaiterSchedule = async (waiterID, dayToRemove, dayToAdd) => {
    await db.none("DELETE FROM admin WHERE waiterID = $1 AND dayID = $2", [waiterID, dayToRemove]);
    // console.log("Successfully deleted");
    await db.none("INSERT INTO admin(dayID, waiterID) VALUES ($1, $2)", [dayToAdd, waiterID]);
  };

  // Function to delete a specific waiter's assignment for a day
  const deleteWaiterAssignment = async (waiterID, dayID) => {
    await db.none("DELETE FROM admin WHERE waiterID = $1 AND dayID = $2", [waiterID, dayID]);
  };

  // Function to retrieve a waiter's ID by their name
  const getWaiterIDByName = async (name) => {
    try {
      const result = await db.oneOrNone("SELECT waiterID FROM waiters WHERE name = $1", name);
      return result ? result.waiterid : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Function to retrieve the days assigned to a specific waiter by their ID
  const getDaysAssignedToWaiter = async (waiterID) => {
    return db.manyOrNone("SELECT dayID FROM admin WHERE waiterID = $1", waiterID);
  };

  // Return an object containing all the defined functions for exporting
  return {
    resetAdminTable,
    insertDay,
    insertWaiter,
    getDays,
    getAdminData,
    updateAdmin,
    setAdminEntry,
    getWaiterByName,
    updateWaiterSchedule,
    getWaiterIDByName,
    deleteWaiterAssignment,
    getDaysAssignedToWaiter,
    getWaiterDaysAssigned,
  };
}
