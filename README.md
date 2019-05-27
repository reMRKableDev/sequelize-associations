# sequelize-associations

An introduction to creating associations with Sequelize on Node.js

## Getting Started

Change the .env.default file to a .env file which will hold the environment variables associated with your database.

Configure your Sequelize connector to read from process.env

```
const connector = new Sequelize(
  process.env.YOUR_DATABASE_NAME,
  process.env.YOUR_DATABASE_USER,
  process.env.YOUR_DATABASE_PASSWORD,
  {
    host: process.env.YOUR_DATABASE_HOST,
    dialect: YOUR_DATABASE_DIALECT
  }
);
```

### Prerequisites

What things you need to install the software and how to install them

```
sequelize
pg
pg-hstore
dotenv
ejs
express
```

### How To:

To use the examples provided:

```
1. Clone repo.
2. Run 'npm install' on your local repo so as to get the required dependencies.
3. Choose desired folder + run node apps.

```

Remember that you can only run the "node app.js" when you are in a folder with an app.js.

Have fun :)
