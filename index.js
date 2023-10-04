// Import necessary modules and dependencies
import express from "express";
import exphbs from 'express-handlebars';
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import dotenv from "dotenv";
import router from './routes/waiterRoutes.js';

dotenv.config();

const app = express();
const hbs = exphbs.create();

// Register Handlebars helper
registerHandlebarsHelpers(hbs);

configureApp(app);

const PORT = process.env.PORT || 3002;
startServer(app, PORT);

// Function to register Handlebars helper
function registerHandlebarsHelpers(hbs) {
  hbs.handlebars.registerHelper('includes', function (arr, item) {
    // Check if 'arr' is an array
    if (Array.isArray(arr)) {
      // Check if 'arr' includes an item with the specified 'day'
      return arr.some(schedule => schedule.day === item);
    }
    return false;
  });
}

function configureApp(app) {
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

  // Use the custom router for handling routes
  app.use('/', router);
}

// Function to start the server
function startServer(app, port) {
  app.listen(port, function () {
    console.log(`app started on port: ${port}`);
  });
}



