require("dotenv").config();
const app = require('./index');

app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);