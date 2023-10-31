// Define a function 'routes' that takes 'queries' as a parameter
import { days } from '../days.js';
import createScheduleProcessor from '../scheduleProcessor.js';
export default function appRoutes(queries) {

  // Initialize variables for error, success, and username
  let error = "";
  let success = "";
  let username = "";

  // Define a regular expression for matching names with at least 3 letters
  let regex = /^([a-zA-Z]{3,})$/;

  // Define an async function 'index' to handle rendering the index page
  async function renderIndex(req, res) {
    res.render("index", {});
  }

async function renderAdmin(req, res) {
  // Initialize arrays for each day of the week
  let daysData = await queries.getDaysOfWeek();

  // Check if the 'daysData' array contains data for all 7 days of the week.
  // If data for all 7 days is available in the database:
  // Initialize empty arrays for each day of the week to store data.
  if (daysData.length === 7) {
    let monday = [];
    let tuesday = [];
    let wednesday = [];
    let thursday = [];
    let friday = [];
    let saturday = [];
    let sunday = [];

    // Retrieve schedule data from the database using 'queries.getAdminSchedule()'
    let schedule = await queries.getAdminSchedule();

    if (schedule) {
      // Use the createScheduleProcessor function to process the schedule data
      let scheduleProcessor = createScheduleProcessor(schedule);
      let processedNames = scheduleProcessor.getNames();
      let processedDaysData = scheduleProcessor.getDaysData();

      // Render the 'admin' page with the collected data
      res.render("admin", {
        ...processedDaysData,
        days: daysData, // Pass the retrieved days of the week
        names: processedNames
      });
    } else {
      // Handle the case where there is no schedule data
      res.render("admin", {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        days: daysData, // Pass the retrieved days of the week
        names: []
      });
    }
  }
  else {
    // Handle the case where days of the week data is not retrieved properly
    res.status(500).send("Error: Days of the week data not available.");
  }
}

async function renderWaiters(req, res) {
  // Extract the 'username' parameter from the request
  let input = req.params.username;

  // Initialize an array for storing waiter days
  let waiterDays = [];

  let dayChecks = {};

  // Loop through the days array and initialize the corresponding properties
  days.forEach(day => {
    const dayKey = `${day.day.toLowerCase()}Checked`;
    dayChecks[dayKey] = false;
  });
  

  // Check if 'input' is provided in the request
  if (input) {
    // Trim and format the 'username'
    var trimmed = input.trim();
    var cap = "";
    var low = "";

    // Capitalize the first letter and make the rest of the name lowercase
    for (let i = 0; i < trimmed.length - 1; ++i) {
      cap = trimmed.charAt(0).toUpperCase();
      low += trimmed.charAt(i + 1).toLowerCase();
    }

    // Format the 'username'
    username = cap + low;
  }

  // Check if the 'username' matches the provided regular expression
  if (regex.test(username)) {
    // Retrieve waiter days from the database using 'queries.getWaiterDaysAssigned(username)'
    waiterDays = await queries.getWaiterDaysAssigned(username);

    // Loop through the waiter days and set corresponding boolean variables
    waiterDays.forEach((waiterDay) => {
      let dayId = waiterDay.dayid;

      // Find the corresponding day object in the 'days' array and update the checkbox
      let dayObject = days.find((day) => day.id === dayId);

      if (dayObject) {
        dayChecks[dayObject.day.toLowerCase() + 'Checked'] = true;
      }
      
    });
  }

  // Set flash messages for error and success
  req.flash("error", getError());
  req.flash("success", getSuccess());

  const displayDays = await queries.getDaysOfWeek();

  // Render the 'waiters' page with the collected data
  res.render("waiters", {
    username,
    displayDays,
    ...dayChecks,
  });

  // Clear the 'success' variable
  success = "";
}

  // Define an async function 'postWaiters' to handle POST requests for the waiters page
  async function handlePostWaiters(req, res) {
    
    // Retrieve selected days and initialize 'waiterID'
    let days = req.body.day;
    let waiterID = 0;

    // Check if the 'username' matches the regular expression
    if (regex.test(username)) {
      // Retrieve the 'waiterID' from the database using 'queries.getWaiterID(username)'
      waiterID = await queries.getWaiterIDByName(username);

      // If 'waiterID' is not found, create a new waiter and retrieve 'waiterID'
      if (waiterID == null || waiterID == undefined) {
        await queries.insertWaiterRecord(username);
        waiterID = await queries.getWaiterIDByName(username);
      }

      // Check if at least 3 days are selected
      if (days) {
        if (days.length < 3 || days.length > 7) {
          error = "Please select at least 3 days";
          success = "";
        } else {
          // Clear the error
          error = "";

          // Update the shift for the selected days using 'queries.removeWaiterFromAdmin(waiterID)' and 'queries.assignWaiterToDay(day, waiterID)'
          await queries.removeWaiterFromAdmin(waiterID);

          // Loop through the selected days and set the corresponding shift in the database
          for (let i = 0; i < days.length; ++i) {
            var day = Number(days[i]);
            await queries.assignWaiterToDay(day, waiterID);
          }

          // Set a success message indicating that the changes have been saved
          success = "Shift updated successfully";
        }
      } else {
        // Clear the error
        error = "";

        // If no days are selected, remove the waiter from the schedule
        await queries.removeWaiterFromAdmin(waiterID);

        // Set a success message indicating that the days have been deselected
        success = "Days deselected successfully";
      }
    } else {
      // Set an error message if the 'username' does not match the regular expression
      error = "Outdated, name must only contain letters";
    }

    // Redirect to the waiters page for the specified 'username'
    res.redirect("/waiters/" + username);
  }

  // Define an async function 'clearSchedule' to handle clearing the schedule
  async function clearSchedule(req, res) {
    try {
      // Reset the schedule in the database using 'queries.reset()'
      await queries.clearAdminSchedule();
      // Redirect to the 'admin' page
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
    }
  }

  // Define an async function 'rm waiter' to handle removing waiter in the schedule
  async function removeWaiter(req, res) {
    // Extract the name of the waiter to remove from the request
    let name = req.body.waiterDelete;

    // Get the waiter's unique ID from the database using their name
    let waiterID = await queries.getWaiterIDByName(name);

    // Extract the day to remove the waiter from
    let dayName = req.body.deleteDay;

    // Initialize a variable to store the day's unique ID
    let dayID = 0;

    // Loop through the days of the week
    for (let i = 0; i < days.length; ++i) {
      var day = days[i];

      // Check if the current day matches the specified day to remove the waiter from
      if (day.day == dayName) {
        // Assign the day's unique ID to the dayID variable
        dayID = day.id;
      }
    }

    try {
      // Attempt to delete the waiter from the specified day in the database
      await queries.deleteWaiter(waiterID, dayID);
    } catch (err) {
      // Handle any potential errors by logging them
      console.log(err);
    }

    // Redirect to the admin page after removing the waiter
    res.redirect("/admin");
  }

  // Define a function 'getError' to get the current error message
  function getError() {
    return error;
  }

  // Define a function 'getSuccess' to get the current success message
  function getSuccess() {
    return success;
  }

  // Return an object with the defined functions as properties
  return {
    renderIndex,
    renderAdmin,
    renderWaiters,
    clearSchedule,
    removeWaiter,
    getError,
    handlePostWaiters
  };
}
