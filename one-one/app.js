require("dotenv").config({ path: "../.env" });
// You most likely don't need to configure the path in the above
// require.
const Sequelize = require("sequelize");

/*
- Setup connection to database with proper credentials
*/
const connector = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres"
  }
);

/* Test my database connection */
connector
  .authenticate()
  .then(() =>
    console.log(`Got a connection with database: ${process.env.DB_NAME}`)
  )
  .catch(error =>
    console.error(`Couldn't connect to the database: ${error.stack}`)
  );

/*
- Person: Model for the people table in your database. 
- License: Model for the drivers_license table in your database
*/
const Person = connector.define("person", {
  first_name: Sequelize.TEXT,
  last_name: Sequelize.TEXT,
  national_identification_number: Sequelize.INTEGER
});

const License = connector.define("drivers_license", {
  license_reference_number: Sequelize.INTEGER,
  allowed_vehicle: Sequelize.STRING,
  issue_date: Sequelize.DATEONLY,
  expiry_date: Sequelize.DATEONLY
});

/* 
- Establishing 1:1 / one-one  association between the tables.
    belongsTo() : Sequelize method for establishing one-one relation.
*/
License.belongsTo(Person); // This adds a person_id column on the drivers_license table

/*
- Create and populate tables.
    SQL QUERY TO TEST WITH ON POSTGRES: select * from people as p inner join drivers_licenses as l on p.id = l."personId";
*/
connector
  .sync({ force: true })
  .then(() => {
    createPeople();
    createLicense();
  })
  .catch(error => {
    console.log(
      `Something went wrong when creating data for table: ${error.stack}`
    );
  });

function createLicense() {
  License.create({
    license_reference_number: 2,
    allowed_vehicle: "B",
    issue_date: "2019-05-27",
    expiry_date: "2029-05-27",
    personId: 2
  })
    .then(() => console.log("Added new license to database!"))
    .catch(error =>
      console.error(`Something went wrong when adding license: ${error.stack}`)
    );
  License.create({
    license_reference_number: 5,
    allowed_vehicle: "A",
    issue_date: "2017-05-27",
    expiry_date: "2027-05-27",
    personId: 1
  })
    .then(() => console.log("Added new license to database!"))
    .catch(error =>
      console.error(`Something went wrong when adding license: ${error.stack}`)
    );
}

function createPeople() {
  Person.create({
    first_name: "McLovin",
    last_name: "McLovin",
    national_identification_number: 32479
  })
    .then(() => console.log("Added new user to database!"))
    .catch(error =>
      console.error(`Something went wrong when adding user: ${error.stack}`)
    );
  Person.create({
    first_name: "Chandler",
    last_name: "Bing",
    national_identification_number: 453454
  })
    .then(() => console.log("Added new user to database!"))
    .catch(error =>
      console.error(`Something went wrong when adding user: ${error.stack}`)
    );
}
