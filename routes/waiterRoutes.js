// Import necessary modules and services
import express from 'express';
import db from '../db.js';
import waiterService from '../services/query.js';

// Create an Express Router instance
const router = express.Router();

// Initialize the waiterRoute service with the database
const waiterRoute = waiterService(db);

// Define routes and their functionality

// Default route to render the index page
router.get('/', (req, res) => {
    res.render('index');
})

// Route to list all schedules for the week and display available waiters
router.get('/days', async (req, res) => {
    try {
        // Retrieve all schedules for the week
        const allSchedules = await waiterRoute.getAllSchedules();
        
        // Render the manager page with the list of schedules
        res.render('manager', {
            allSchedules
        });
    }
    catch (error) {
        console.error('Failure to get schedules');
    }
})

// Route to add a waiter's availability
router.post('/waiters', async (req, res) => {
    try {
        const waiterName = req.body.username;
        const dayOfTheWeek = req.body.days;

        // Insert the waiter's name and availability into the tables
        await waiterRoute.waiters(waiterName, dayOfTheWeek);
        console.log(waiterName, dayOfTheWeek);

        // Redirect to the waiter's schedule page
        res.redirect(`/waiters/${waiterName}`);
    }
    catch (error) {
        console.error('Failure to post schedules');
    }
})

// Route to display a specific waiter's schedule
router.get('/waiters/:username', async (req, res) => {
    try {
        const name = req.params.username;
        
        // Retrieve the schedule for a specific waiter
        const waiterSchedule = await waiterRoute.getWaiterSchedule(name);
        
        // Render the waiters page with the waiter's schedule
        res.render('waiters', {
            waiterSchedule,
            username: name
        });
    } catch (error) {
        console.error('Failure to get schedules');
    }
})

// Route to cancel a waiter's availability for a specific day
router.post('/waiters/:username/cancel', async (req, res) => {
    try {
        const waiterName = req.params.username;
        const day = req.body.day;

        // Remove the waiter's availability for the specified day
        await waiterRoute.cancel(waiterName, day);
        
        // Redirect back to the waiter's schedule page
        res.redirect(`/waiters/${waiterName}`);
    }
    catch (error) {
        console.error('Failure to cancel schedule');
    }
})

// Export the Express Router instance
export default router;
