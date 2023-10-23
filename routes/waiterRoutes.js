// Export the Waiter Routes Module
export default function waiterRoutes(waiterRoute) {

    // Function to display the main index page
    async function displayIndexPage(req, res, next) {
        try {
            res.render('index', {
                messages: req.flash()
            });
        } catch (error) {
            next(error);
        }
    }

    // Function to display all schedules and highlight staffing status
    async function displayAllSchedules(req, res, next) {
        try {
            // Retrieve all schedules for the week to see available waiters
            const allSchedules = await waiterRoute.getScheduleByDay();

            // Determine staffing status and assign colors
            for (const day in allSchedules) {
                const { count } = allSchedules[day];

                if (count < 3) {
                    allSchedules[day].status = "orange";
                } else if (count === 3) {
                    allSchedules[day].status = "green";
                } else if (count > 3) {
                    allSchedules[day].status = "red";
                }
            }

            // Pass the updated schedules to the template
            res.render('admin', {
                allSchedules
            });

        } catch (error) {
            req.flash('error', 'Error displaying schedules');
            next(error);
        }
    }

    // Function to update a waiter's schedule
    async function updateWaiterSchedule(req, res, next) {
        try {
            const waiterName = req.params.username;
            const selectedDays = req.body.days;

            // Update the waiter's name and working days in the tables
            await waiterRoute.updateSchedule(waiterName, selectedDays);

            res.redirect(`/waiters/${waiterName}/update`);
        } catch (error) {
            next(error);
        }
    }

    // Function to get and display a waiter's updated schedule
    async function displayWaiterUpdatedSchedule(req, res, next) {
        try {
            const waiterName = req.params.username;

            const waiterSchedule = await waiterRoute.getWaiterSchedule(waiterName);

            if (waiterSchedule.length >= 3) {
                req.flash('success', `Shift updated successfully!`);
            } else {
                req.flash('error', 'Please choose at least 3 days.');
            }

            res.render('waiters', {
                waiterSchedule,
                username: waiterName
            });
        } catch (error) {
            next(error);
        }
    }

    // Function to display a waiter's schedule
    async function displayWaiterSchedule(req, res, next) {
        try {
            const waiterName = req.params.username;

            const waiterSchedule = await waiterRoute.getWaiterSchedule(waiterName);

            res.render('waiters', {
                waiterSchedule,
                username: waiterName
            });
        } catch (error) {
            next(error);
        }
    }

    // Function to reset all data
    async function resetData(req, res, next) {
        try {
            await waiterRoute.reset();
            req.flash('Success', 'Reset Successful!');
            res.redirect('/admin');
        } catch (error) {
            console.error('Error resetting data', error);
            req.flash('error', 'Error clearing data');
            next(error);
        }
    }

    // Return the public functions of the module
    return {
        displayIndexPage,
        displayAllSchedules,
        updateWaiterSchedule,
        displayWaiterUpdatedSchedule,
        displayWaiterSchedule,
        resetData
    };
}
