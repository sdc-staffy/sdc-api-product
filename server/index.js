require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());


//get list of all products (default limit 5)

//get one product information 
    //product info + features

//get one product's styles 

//get one product's related products


app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);
