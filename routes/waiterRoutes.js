// Export the appRoutes function as the default module
export default function appRoutes(waiterRoute) {

  // Define a function to show the index page
  async function renderIndex(req, res) {
    try {
      // Render the 'index' template with flash messages
      res.render('index', {
        messages: req.flash()
      });

    } catch (error) {
      
    }
  }

  // Define a function to show all schedules
  async function renderAdmin(req, res) {
    try {
      // List all the schedules for the week to see available waiters
      const allSchedules = await waiterRoute.countWaitersByDay();

      // Loop through each day in the schedules and set staffingStatus based on the count
      for (const day in allSchedules) {
        const { count } = allSchedules[day];

        if (count === 2) {
          allSchedules[day].status = "orange";
        } else if (count === 3) {
          allSchedules[day].status = "green";
        } else if (count === 1) {
          allSchedules[day].status = "red";
        } else if (count > 3) {
          allSchedules[day].status = "grey";
        }
      }

      // Render the 'admin' template with allSchedules data
      res.render('admin', {
        allSchedules
      });

    } catch (error) {
      // Set a flash error message and handle errors
      req.flash('error', 'error showing schedules');
      
    }
  }

  // Define a function to update a waiter's schedule
  async function handlePostWaiters(req, res) {
    try {
      // Extract waiterName and dayOfTheWeek from the request
      const waiterName = req.params.username;
      const dayOfTheWeek = req.body.days;

      // Update the waiter's schedule in the database
      await waiterRoute.updateWaiterAvailability(waiterName, dayOfTheWeek);

      // Redirect to the waiter's update page
      res.redirect(`/waiters/${waiterName}/update`);
    } catch (error) {
      
    }
  }

 // Define a function to get a waiter's updated schedule
async function getWaiterUpdatedSchedule(req, res) {
  try {
    // Extract waiterName from the request
    const waiterName = req.params.username;

    // Retrieve the waiter's schedule and available days
    const waiterShift = await waiterRoute.getWaiterAvailability(waiterName);
    const days = await waiterRoute.retrieveWeekdays();

    // Create an array of selected days
    const selectedDays = waiterShift.map(day => day.day);

    // Handle flash messages based on the retrieved data
    if (waiterShift === undefined) {
      req.flash('error', 'Waiter schedule not found.');
    } else if (selectedDays.length >= 3) {
      req.flash('success', 'Shift updated successfully');
    } else {
      req.flash('error', 'Please select at least 3 days');
    }

    // Render the 'waiters' template with data
    res.render('waiters', {
      waiterShift,
      username: waiterName,
      days,
      selectedDays: selectedDays, // Pass selected days to the template
    });
    // console.log('Selected Days:', selectedDays);
  } catch (error) {
    console.error(error.message);
  }
 
}

  // Define a function to show a waiter's schedule
  async function renderWaiters(req, res) {
    try {
      // Extract waiterName from the request
      const waiterName = req.params.username;

      // Retrieve the waiter's schedule and available days
      const  waiterShift = await waiterRoute.getWaiterAvailability(waiterName);
      const days = await waiterRoute.retrieveWeekdays();

      // Render the 'waiters' template with data
      res.render('waiters', {
        waiterShift,
        username: waiterName,
        days
      });
    } catch (error) {
      
    }
  }

  // Define a function to reset the schedule
  async function resetSchedule(req, res) {
    try {
      // Reset the schedule data in the database
      await waiterRoute. resetDatabase();

      res.redirect('/admin');
    } catch (error) {
      
    }
  }

  // Return the defined functions as an object
  return {
    renderIndex,
    renderAdmin,
    handlePostWaiters,
    getWaiterUpdatedSchedule,
    renderWaiters,
    resetSchedule
  }
}
