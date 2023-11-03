import express from 'express';
import exphbs from 'express-handlebars';
import { engine } from 'express-handlebars'
import bodyParser from 'body-parser';
import flash from 'express-flash';
import pgPromise from 'pg-promise';
import session from 'express-session';
import appRoutes from './routes/waiterRoutes.js';
import createDatabaseQueries from './services/query.js';

const app = express();
const hbs = exphbs.create();

const connectionString = process.env.PGDATABASE_URL ||
 'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe'

const pgp = pgPromise();
const db = pgp(connectionString);

const waiterdb = createDatabaseQueries(db);
const waiterRoute = appRoutes(waiterdb)


//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

//handlebars helpers

hbs.handlebars.registerHelper('includes', function (arr, item) {
  // Check if arr is defined and is an array
  if (Array.isArray(arr)) {
    // Map the array of objects to an array of days
    const days = arr.map(a => a.day);
    // Check if the item is included in the array of days
    return days.includes(item);
  } else {
    // Handle the case where arr is not an array
    return false;
  }
});

hbs.handlebars.registerHelper('getStatus', function (count) {
  if (count === 1) {
    return 'red';
  } else if (count === 2) {
    return 'orange';
  } else if (count === 3) {
    return 'green';
  } else {
    return 'grey';
  }
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', waiterRoute.renderIndex)
app.get('/admin', waiterRoute.renderAdmin)
app.post('/waiters/:username/update', waiterRoute.handlePostWaiters)
app.get('/waiters/:username/update', waiterRoute.getWaiterUpdatedSchedule)
app.get('/waiters/:username', waiterRoute.renderWaiters)
app.post('/reset', waiterRoute.resetSchedule)


const PORT = process.env.PORT || 3006
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});