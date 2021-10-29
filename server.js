const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const { PORT } = require("./config");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);


mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log(con.connections);
  console.log("DB Connection successful")
});



app.listen(PORT, () => {
  console.log(`Started on http://localhost:${PORT}`);
});
