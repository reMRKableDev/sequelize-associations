require("dotenv").config({ path: "../.env" });
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

/*
- Blogger: Model for the blogger table in your database. 
- Post: Model for the posts table in your database
*/
const Blogger = connector.define("blogger", {
  name: Sequelize.STRING
});

const Post = connector.define("post", {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
});

/* 
- Establishing 1:M / one-many  association between the tables.
    hasMany() : Sequelize method for establishing one-many relation.
    belongsTo() : Sequelize method for establishing one-one relation.
*/
Blogger.hasMany(Post);
Post.belongsTo(Blogger); // creates a bloggerId column in posts table.

/*
- Create and populate tables.
    SQL QUERY TO TEST WITH ON POSTGRES: select distinct b.* from bloggers b inner join posts p  on p."bloggerId" = p.id;
*/
connector
  .sync({
    force: true
  })
  .then(() => {
    Blogger.create({
      name: "Milo Whitwicki"
    })
      .then(() => {
        Post.create({
          title: "Wonders of the sea",
          body: "There is a lost civilization at the bottom of the ocean",
          bloggerId: 1
        });
        Post.create({
          title: "Wonders of the sea part 2",
          body: "There is another lost civilization at the bottom of the ocean",
          bloggerId: 1
        });
        Post.create({
          title: "Wonders of the sea part 3",
          body: "They just to keep popping up down here!!",
          bloggerId: 1
        });
      })
      .catch(error =>
        console.error(`Something went wrong when creating: ${error.stack}`)
      );
  })
  .catch(error => {
    console.error(
      `Something went wrong when creating data for table: ${error.stack}`
    );
  });
