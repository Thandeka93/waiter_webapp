// scheduleProcessor.js

export default function createScheduleProcessor(schedule) {
    let names = [];
    let monday = [];
    let tuesday = [];
    let wednesday = [];
    let thursday = [];
    let friday = [];
    let saturday = [];
    let sunday = [];
  
    // Loop through the schedule data and categorize names based on the day of the week
    for (let i = 0; i < schedule.length; ++i) {
      const entry = schedule[i];
  
      if (!names.includes(entry.name)) {
        names.push(entry.name);
      }
  
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
  
    // Return an object with functions to access the processed data
    return {
      getNames: () => names,
      getDaysData: () => ({ monday, tuesday, wednesday, thursday, friday, saturday, sunday }),
    };
  }
  