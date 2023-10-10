// Define a default export function called 'routes' that takes a 'queries' parameter.
export default function appRoutes(queries) {

    // Initialize variables for error and success messages, and a username.
    let error = "";
    let success = "";
    let username = "";

    // Define a regular expression for validating usernames with at least 3 letters.
    let regex = /^([a-zA-Z]{3,})$/;

    // Define an array of objects representing days of the week with IDs.
    const days = [
        { "day": "Monday", id: 1 },
        { "day": "Tuesday", "id": 2 },
        { "day": "Wednesday", "id": 3 },
        { "day": "Thursday", "id": 4 },
        { "day": "Friday", "id": 5 },
        { "day": "Saturday", "id": 6 },
        { "day": "Sunday", "id": 7 }
    ];

    // Define an asynchronous function 'home' that handles rendering the "index" page.
    async function index(req, res) {
        res.render("index", {
            // Render the "index" page with no additional data.
        });
    }

    // Define an asynchronous function 'admin' that handles rendering the "admin" page.
    async function admin(req, res) {

        // Initialize arrays and variables for storing schedule data.
        let monday = [];
        let tuesday = [];
        let wednesday = [];
        let thursday = [];
        let friday = [];
        let saturday = [];
        let sunday = [];
        let names = [];

        // Fetch the admin schedule data from the 'queries' object.
        let schedule = await queries.getAdminData();

        if (schedule) {
            // Loop through the schedule data to organize it by day and names.
            for (let i = 0; i < schedule.length; ++i) {
                var entry = schedule[i];
                if (!names.includes(entry.name)) {
                    names.push(entry.name);
                }
                // Categorize entries based on the day of the week.
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
        // Render the "admin" page with organized data.
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

    // Define an asynchronous function 'waiters' that handles rendering the "waiters" page.
    async function waiters(req, res) {
        // Initialize variables and flags for waiter information.
        let input = req.params.username;
        let waiterDays = [];
        let monChecked = false;
        let tuesChecked = false;
        let wedChecked = false;
        let thurChecked = false;
        let friChecked = false;
        let satChecked = false;
        let sunChecked = false;

        if (input) {
            // Trim and format the input username.
            var trimmed = input.trim();
            var cap = "";
            var low = "";

            for (let i = 0; i < trimmed.length - 1; ++i) {
                cap = trimmed.charAt(0).toUpperCase();
                low += trimmed.charAt(i + 1).toLowerCase();
            }
            username = cap + low;
        }

        if (regex.test(username)) {
            // Fetch waiter days based on the validated username.
            waiterDays = await queries.getWaiterDaysAssigned(username);

            for (let i = 0; i < waiterDays.length; ++i) {
                let day = waiterDays[i].dayid;

                // Set flags for checked days based on fetched data.
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

        // Flash error and success messages and render the "waiters" page.
        req.flash("error", getError());
        req.flash("success", getSuccess());

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

        // Reset the 'success' message.
        success = "";
    }

    // Define an asynchronous function 'postWaiters' that handles POST requests for the "waiters" page.
    async function postWaiters(req, res) {
        // Extract data from the request.
        let days = req.body.day;
        let waiterID = 0;

        if (regex.test(username)) {
            // Validate username using the regex pattern.

            waiterID = await queries.getWaiterIDByName(username);

            if (waiterID == null || waiterID == undefined) {
                //If waiter ID is not found, insert a new waiter.
                await queries.insertWaiter(username);
                waiterID = await queries.getWaiterIDByName(username);
            } else {
                // Continue with the insertion and update logic.
                if (days) {
                    // Check the number of selected days.
                    if (days.length < 3 || days.length > 5) {
                        error = "Select a minimum of 3 and a maximum of 5 days";
                        success = "";
                    } else {
                        error = "";
                        success = "Shift updated successfully";

                        // Update the database with selected days.
                        await queries.updateAdmin(waiterID);

                        for (let i = 0; i < days.length; ++i) {
                            var day = Number(days[i]);
                            await queries.setAdminEntry(day, waiterID);
                        }
                    }
                }
            }
        }

        // Redirect to the "waiters" page with the updated data.
        res.redirect("/waiters/" + username);
    }

    // Define an asynchronous function 'clearSchedule' that handles clearing the schedule.
    async function clearSchedule(req, res) {
        try {
            // Reset the schedule data in the database.
            await queries.resetAdminTable();
            res.redirect("/admin");
        } catch (err) {
            console.log(err);
        }
    }

    // Define an asynchronous function 'updateSchedule' that handles updating the schedule.
    async function updateSchedule(req, res) {

    }

    // Define an asynchronous function 'removeWaiter' that handles removing a waiter from the schedule.
    async function removeWaiter(req, res) {

    }

    // Define a function 'getError' that returns the current error message.
    function getError() {
        return error;
    }

        // Define a function 'getSuccess' that returns the current success message.
        function getSuccess() {
            return success;
        }

        // Return an object containing all the defined functions for exporting.
        return {
            index,
            admin,
            waiters,
            clearSchedule,
            getError,
            postWaiters,
            updateSchedule,
            removeWaiter,
            getSuccess

        }
    }
