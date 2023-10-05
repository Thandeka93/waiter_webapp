// Import necessary modules and dependencies
import express from 'express'; // Import the Express framework
import db from '../db.js'; // Import a database module
import waiterService from '../services/query.js'; // Import a waiter service module

// Create an Express router instance
const router = express.Router();

// Create a waiterRoute instance by passing the database connection
const waiterRoute = waiterService(db);

// Define a route for handling GET requests to the root path ('/')
router.get('/', (req, res) => {
    // Render the 'index' view
    res.render('index');
});

// Define a route for handling GET requests to the '/days' path
router.get('/days', async (req, res) => {
    try {
        // List all the schedules for the week to see available waiters
        const allSchedules = await waiterRoute.getAllSchedules();
        // List days and the number of available waiters
        res.render('admin', {
            allSchedules
        });
    } catch (error) {
        console.error('Error fetching schedules:', error.message);

    }
});

// Define a route for handling POST requests to update waiter information
router.post('/waiters/:username/update', async (req, res) => {
    try {
        const waiterName = req.params.username;
        const dayOfTheWeek = req.body.days || [];

        // Store the selected days in a session variable
        req.session.selectedDays = dayOfTheWeek;

        // Get the waiter name and days and insert them into the tables
        await waiterRoute.updateWaiterAvailability(waiterName, dayOfTheWeek); // Call the function for updating the name and days
        console.log(waiterName, dayOfTheWeek);
        // Redirect to the update page for the specific waiter
        res.redirect(`/waiters/${waiterName}/update`);
    } catch (error) {
        console.error('Error fetching schedules:', error.message);

    }
});

// Define a route for handling GET requests to the waiter update page
router.get('/waiters/:username/update', async (req, res) => {
    try {
        const name = req.params.username;
        // Get the schedule for the specified waiter
        const waiterSchedule = await waiterRoute.getWaiterSchedule(name);

        // Retrieve the selected days from the session
        const selectedDays = req.session.selectedDays || [];

        // Render the 'waiters' view for updating waiter information
        res.render('waiters', {
            waiterSchedule,
            username: name,
            selectedDays, // Pass the selected days to the template
        });
    } catch (error) {
        console.error('Error fetching schedules:', error.message);

    }
});

// Define a route for handling GET requests to view waiter information
router.get('/waiters/:username', async (req, res) => {
    try {
        const name = req.params.username;
        // Get the schedule for the specified waiter
        const waiterSchedule = await waiterRoute.getWaiterSchedule(name);
        // Render the 'waiters' view for viewing waiter information
        res.render('waiters', {
            waiterSchedule,
            username: name
        });
    } catch (error) {
        console.error('Error fetching schedules:', error.message);

    }
});

// Export the router to make it available for use in other modules
export default router;

