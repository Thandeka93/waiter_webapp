import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import flash from 'express-flash';
import session from 'express-session';
import pgPromise from 'pg-promise';
import createDatabaseQueries from './services/query.js';
import appRoutes from './routes/waiterRoutes.js';

const app = express();

app.use(express.static('public'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.static('images'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(session({
  secret: "no secret",
  resave: false,
  saveInitialized: false
}));
app.use(flash());

const connectionString =
  process.env.PGDATABASE_URL ||
  'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';

const pgp = pgPromise();
const db = pgp(connectionString);

const queries = createDatabaseQueries(db);
const routes= appRoutes(queries);

app.get("/",routes.renderIndex);
app.all("/admin",routes.renderAdmin);
app.get("/waiters/:username",routes.renderWaiters);
app.post("/waiters",routes.handlePostWaiters);
app.post("/clear", routes.clearSchedule);
app.post("/removeWaiter",routes.removeWaiter);

const PORT= process.env.PORT||3006;
app.listen(PORT,function(){
    console.log("App starting on port "+PORT);
});






