// Import necessary modules and services
import express from 'express';
import db from '../db.js'; // Import the database connection
import waiter from '../services/query.js'; // Import the waiter service

const router = express.Router();
const waiterRoute = waiter(db); // Create a waiter route using the waiter service and the database connection

// Handle requests to the root path
router.get('/', (req, res) => {
    res.render('index'); // Render the 'index' view
});

// Handle requests to '/days'
router.get('/days', async (req, res) => {
    try {
        // List all the schedules for the week to see available waiters
        const allSchedules = await waiterRoute.getAllSchedules(); // Call the service function to get all schedules

        // List days and the number of available waiters and render the 'manager' view
        res.render('manager', {
            allSchedules
        });
    } catch (error) {
        console.error('Fail to get schedules');
    }
});

// Handle POST requests to '/waiters'
router.post('/waiters', async (req, res) => {
    try {
        const waiterName = req.body.username;
        const dayOfTheWeek = req.body.days;

        // Get the waiter name and days and insert them into the tables
        await waiterRoute.waiters(waiterName, dayOfTheWeek); // Call the service function to insert waiter data

        console.log(waiterName, dayOfTheWeek);

        res.redirect(`/waiters/${waiterName}`); // Redirect to the waiter's schedule page
    } catch (error) {
        console.error('Fail to post schedules');
    }
});

// Handle requests to '/waiters/:username'
router.get('/waiters/:username', async (req, res) => {
    try {
        const name = req.params.username;

        // Get each waiter's schedule using the service function
        const waiterSchedule = await waiterRoute.getWaiterSchedule(name);

        // Render the 'waiters' view with the waiter's schedule and username
        res.render('waiters', {
            waiterSchedule,
            username: name
        });
    } catch (error) {
        console.error('Fail to get schedules');
    }
});

// Handle POST requests to '/waiters/:username/cancel'
router.post('/waiters/:username/cancel', async (req, res) => {
    try {
        const waiterName = req.params.username;
        const day = req.body.day;

        // Remove the available name using the service function
        await waiterRoute.cancel(waiterName, day);

        res.redirect(`/waiters/${waiterName}`); // Redirect to the waiter's schedule page
    } catch (error) {
        console.error('Fail to cancel schedule');
    }
});

export default router;
