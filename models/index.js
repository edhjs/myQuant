const Sequelize = require("sequelize");

const db = {};
const sequelize = new Sequelize(
  "mydb",
  process.env.MYSQL_ID,
  process.env.MYSQL_PW,
  { host: process.env.MYSQL_DB, dialect: "mysql" }
);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Code = require("./Code")(sequelize, Sequelize);
module.exports = db;
