// // Fetch days from the database and populate the checkboxes
// async function populateCheckboxes() {
//   try {
//       const days = await retrieveWeekdays(); // Assuming this function fetches days from the database

//       const checkboxContainer = document.getElementById('checkbox-container');

//       // Create checkboxes based on the days data
//       days.forEach(day => {
//           const checkbox = document.createElement('input');
//           checkbox.type = 'checkbox';
//           checkbox.name = 'days';
//           checkbox.value = day;
//           if (waiterShift.includes(day)) {
//               checkbox.checked = true;
//           }

//           const label = document.createElement('label');
//           label.htmlFor = day;
//           label.textContent = day;

//           checkboxContainer.appendChild(checkbox);
//           checkboxContainer.appendChild(label);
//           checkboxContainer.appendChild(document.createElement('br'));
//       });
//   } catch (error) {
//       console.error(error.message);
//   }
// }

// // Call the function to populate checkboxes when the page loads
// populateCheckboxes();
