// Import Handlebars
import Handlebars from 'handlebars';

// Define the isChecked Handlebars helper
Handlebars.registerHelper('isChecked', function(day, options) {
  // Check if the day should be checked based on the dayChecks object
  if (dayChecks && dayChecks[day.day.toLowerCase()]) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// Export Handlebars if needed
export default Handlebars;





