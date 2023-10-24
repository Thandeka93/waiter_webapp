// Define a function 'routes' that takes 'queries' as a parameter
export default function appRoutes(queries) {

    // Initialize variables for error, success, and username
    let error = "";
    let success = "";
    let username = "";

    // Define a regular expression for matching names with at least 3 letters
    let regex = /^([a-zA-Z]{3,})$/;
  
    // Define an array of days of the week
    const days = [
      { "day": "Monday", id: 1 },
      { "day": "Tuesday", id: 2 },
      { "day": "Wednesday", id: 3 },
      { "day": "Thursday", id: 4 },
      { "day": "Friday", id: 5 },
      { "day": "Saturday", id: 6 },
      { "day": "Sunday", id: 7 }
    ];
  
    // Define an async function 'index' to handle rendering the index page
    async function index(req, res) {
      res.render("index", {});
    }
  
    // Define an async function 'admin' to handle rendering the admin page
    async function admin(req, res, ) {
      // Initialize arrays for each day of the week
      let monday = [];
      let tuesday = [];
      let wednesday = [];
      let thursday = [];
      let friday = [];
      let saturday = [];
      let sunday = [];
      // Initialize an array for storing names
      let names = [];
  
      // Retrieve schedule data from the database using 'queries.getAdmin()'
      let schedule = await queries.getAdminSchedule();
  
      if (schedule) {
        // Loop through the schedule data
        for (let i = 0; i < schedule.length; ++i) {
          var entry = schedule[i];
  
          // Check if the name is not already in the 'names' array and add it
          if (!names.includes(entry.name)) {
            names.push(entry.name);
          }
  
          // Categorize names based on the day of the week
          switch (entry.day) {
            case "Monday":
              monday.push(entry.name);
              break;
            case "Tuesday":
              tuesday.push(entry.name);
              break;
            case "Wednesday":
              wednesday.push(entry.name);
              break;
            case "Thursday":
              thursday.push(entry.name);
              break;
            case "Friday":
              friday.push(entry.name);
              break;
            case "Saturday":
              saturday.push(entry.name);
              break;
            case "Sunday":
              sunday.push(entry.name);
              break;
          }
        }
      }
  
      // Render the 'admin' page with the collected data
      res.render("admin", {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        days,
        names
      });
    }
  
    // Define an async function 'waiters' to handle rendering the waiters page
    async function waiters(req, res) {
      // Extract the 'username' parameter from the request
      let input = req.params.username;
      // Initialize an array for storing waiter days
      let waiterDays = [];
      // Initialize boolean variables for each day of the week
      let monChecked = false;
      let tuesChecked = false;
      let wedChecked = false;
      let thurChecked = false;
      let friChecked = false;
      let satChecked = false;
      let sunChecked = false;
  
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
        // Retrieve waiter days from the database using 'queries.getWaiterDays(username)'
        waiterDays = await queries.getWaiterDaysAssigned(username);
  
        // Loop through the waiter days and set corresponding boolean variables
        for (let i = 0; i < waiterDays.length; ++i) {
          let day = waiterDays[i].dayid;
          switch (day) {
            case 1:
              monChecked = true;
              break;
            case 2:
              tuesChecked = true;
              break;
            case 3:
              wedChecked = true;
              break;
            case 4:
              thurChecked = true;
              break;
            case 5:
              friChecked = true;
              break;
            case 6:
              satChecked = true;
              break;
            case 7:
              sunChecked = true;
              break;
          }
        }
      }
      
  
      // Set flash messages for error and success
      req.flash("error", getError());
      req.flash("success", getSuccess());
  
      // Render the 'waiters' page with the collected data
      res.render("waiters", {
        monChecked,
        tuesChecked,
        wedChecked,
        thurChecked,
        friChecked,
        satChecked,
        sunChecked,
        username
      });
  
      // Clear the 'success' variable
      success = "";
    }
  
    // Define an async function 'postWaiters' to handle POST requests for the waiters page
    async function postWaiters(req, res) {
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
            // Clear the error and set a success message
            error = "";
            success = "Shift updated successfully";
  
            // Update the shift for the selected days using 'queries.update(waiterID)'
            await queries.removeWaiterFromAdmin(waiterID);
  
            // Loop through the selected days and set the corresponding shift in the database
            for (let i = 0; i < days.length; ++i) {
              var day = Number(days[i]);
              await queries.assignWaiterToDay(day, waiterID);
            }
          }
        }
      } else {
        // Set an error message if the 'username' does not match the regular expression
        error = "Not updated. Name should only contain letters.";
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
      index,
      admin,
      waiters,
      clearSchedule,
      getError,
      postWaiters
    };
  }
  