const mongoose = require('mongoose')

const app = require("./app");
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})

mongoose.connect(process.env.DATABASE_LOCAL, {}).then(() => console.log("DB Connection successful"))

const port = process.env.PORT || 4000;



app.listen(port, () => {
  console.log(`server listening to the port http://127.0.0.1:${port}`);
});
