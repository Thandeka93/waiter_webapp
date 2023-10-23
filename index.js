//import all dependencies
import express from 'express';
import exphbs from 'express-handlebars';
import { engine } from 'express-handlebars'
import bodyParser from 'body-parser';
import flash from 'express-flash';
import pgPromise from 'pg-promise';
import session from 'express-session';
import waiterRoutes from './routes/waiterRoutes.js';
import waiter from './services/query.js';

const app = express();

// Define the database connection string
const connectionString =
  process.env.PGDATABASE_URL ||
  'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';

// Create a PostgreSQL database instance
const pgp = pgPromise();
const db = pgp(connectionString);

// Create an instance of the Express Handlebars
const hbs = exphbs.create();
const waiterdb = waiter(db);

// Create routes using waiterRoutes
const waiterRoute = waiterRoutes(waiterdb);

// Add body-parser middleware for parsing JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure the session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Add flash messages middleware
app.use(flash());

// Register a custom handlebars helper
hbs.handlebars.registerHelper('includes', function(arr, item) {
  // Map the array of objects to an array of days
  const days = arr.map(a => a.day);
  // Check if the item is included in the array of days
  return days.includes(item);
});

// Set the Handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes
app.get('/', waiterRoute.displayIndexPage);
app.get('/admin', waiterRoute.displayAllSchedules);
app.post('/waiters/:username/update', waiterRoute.updateWaiterSchedule);
app.get('/waiters/:username/update', waiterRoute.displayWaiterUpdatedSchedule);
app.get('/waiters/:username', waiterRoute.displayWaiterSchedule);
app.post('/reset', waiterRoute.resetData);

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});





