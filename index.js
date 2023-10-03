import express from "express";
import {engine} from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import dotenv from "dotenv";
import router from './routes/waiterRoutes.js';

dotenv.config();
const app = express();

// const connectionString = process.env.PGDATABASE_URL || 
// 'postgres://ersfpvqe:bYZyNT95SJyVuqA45h3TYcLIJb6bWynP@dumbo.db.elephantsql.com/ersfpvqe';

// const pgp = pgPromise();
// const db = pgp(connectionString);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use('/', router);


const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
  console.log(`app started on port: ${PORT}`);
});