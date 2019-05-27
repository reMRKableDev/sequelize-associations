require("dotenv").config({ path: "../.env" });

const Sequelize = require("sequelize");
const express = require("express");

/* Database configuration */
const connector = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres"
  }
);

/* 
Test your database connection.
 ---This step is not necessary when you later start building your applications, 
    however, it is a good practice to include when developing projects.
*/
connector
  .authenticate()
  .then(() => {
    console.log(`Connection made to database: ${process.env.DB_NAME}`);
  })
  .catch(error => {
    console.error(`Connection couldn't be made: ${error.stack}`);
  });

/* Model definition of tables that will later be created in your database */
const User = connector.define("user", {
  user_name: Sequelize.STRING
});

const Language = connector.define("language", {
  language_name: Sequelize.STRING
});

const Fluency = connector.define("fluency", {
  level: Sequelize.STRING
});

/* Establish Many-to-many (M:M) association between the tables */
User.belongsToMany(Language, { through: Fluency });
Language.belongsToMany(User, { through: Fluency });

/* Express configurations*/
const app = express();
const port = process.env.PORT || 3000;

/* 
Setup template engine.

A template engine enables you to use static template files in your application.
*/
app.set("view engine", "ejs");

/* 
Express middleware: express.urlencoded()

This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads.
Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header
matches the type option.
 */
app.use(express.urlencoded({ extended: false }));

/* 
This app.get() routes to the home ("/") endpoint and holds the logic for retrieving data from the tables created above.
*/
app.get("/", (req, res) => {
  /* 
  Promise.all is actually a promise that takes an array of promises as an input (an iterable). 
  Then it gets resolved when all the promises get resolved or any one of them gets rejected. 
  */

  Promise.all([User.findAll(), Language.findAll(), Fluency.findAll()])
    .then(retrievedData => {
      /*  
      retrievedData is the data found in the database, if any.
      retrievedData is a nested array with the innermost array containing the data of the users added to the db.
      */
      let users = retrievedData[0].map(resultsRow => {
        return {
          id: resultsRow.dataValues.id,
          name: resultsRow.dataValues.user_name
        };
      });

      console.log("Users: ", users);

      let languages = retrievedData[1].map(resultsRow => {
        return {
          id: resultsRow.dataValues.id,
          name: resultsRow.dataValues.language_name
        };
      });

      console.log("Languages: ", languages);

      let fluencies = retrievedData[2].map(resultsRow => {
        let userName = users.find(user => {
          return user.id === resultsRow.dataValues.userId;
        }).name;

        let languageName = languages.find(
          language => language.id === resultsRow.dataValues.languageId
        ).name;

        return {
          userId: resultsRow.dataValues.userId,
          username: userName,
          languageId: resultsRow.dataValues.languageId,
          languagename: languageName,
          level: resultsRow.dataValues.level
        };
      });

      console.log("Fluencies: ", fluencies);

      res.render("index", {
        people: users,
        languages: languages,
        fluencies: fluencies
      });
    })
    .catch(error => {
      console.error(`Something went wrong with Promise.all(): ${error.stack}`);
    });
});

/*
 The app.post() routes to the user endpoint and holds the logic for creating and inserting new data of a user passed by the Client (front-end).
*/
app.post("/user", (req, res) => {
  User.create({
    user_name: req.body.username
  })
    .then(() => res.redirect("/"))
    .catch(error => console.error(`Couldn't create user: ${error.stack}`));
});

/*
 This app.post() routes to the languages endpoint and holds the logic for creating and inserting new data of a user passed by the Client (front-end).
*/
app.post("/language", (req, res) => {
  Language.create({
    language_name: req.body.language
  })
    .then(() => res.redirect("/"))
    .catch(error => console.error(`Couldn't create user: ${error.stack}`));
});

/*
 This app.post() routes to the fluency endpoint and holds the logic for creating and inserting new data of a user passed by the Client (front-end).
*/

app.post("/fluency", (req, res) => {
  Fluency.create({
    level: req.body.fluency,
    userId: req.body.userId,
    languageId: req.body.languageId
  })
    .then(() => res.redirect("/"))
    .catch(error => console.error(`Couldn't create fluency: ${error.stack}`));
});

/* 
Listen to the port & establish a constant connection with the database as soon as app is running.
*/
connector
  .sync({ force: true })
  .then(() => {
    app.listen(port, () => console.log(`We've got liftoff on port: ${port}`));
  })
  .catch(error =>
    console.error(
      `Something went wrong when connecting to database: ${error.stack}`
    )
  );
