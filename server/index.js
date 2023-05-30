require("dotenv").config();
const express = require("express");
const db = require('./db/db.js');
const {getAllProducts, getProductInfo, getStyleInfo, getRelatedProducts} = require('./controller.js');

const app = express();
app.use(express.json());


app.get('/products', (req, res) => {
    const count = req.query.count ? req.query.count: 5;
    getAllProducts(count)
        .then((data) => {
            res.send(data)
        })
        .catch((err)=>console.log('could not get products:', err))
})


app.get('/products/:product_id', (req, res) => {
    const product_id = Number.parseInt(req.params.product_id)

     getProductInfo(product_id)
        .then((data) => {
            res.send(data)
        })
        .catch((err)=>console.log('could not get products:', err))
})



app.get('/products/:product_id/styles', (req, res) => {
    const product_id = Number.parseInt(req.params.product_id)
    
    getStyleInfo(product_id)
        .then((data) => {
            res.send(data)
        })
})

app.get('/products/:product_id/related', (req, res) => {
    const product_id = Number.parseInt(req.params.product_id)

     getRelatedProducts(product_id)
        .then((data) => {
            res.send(data)
        })
})

module.exports = { app, db, getAllProducts, getProductInfo, getStyleInfo, getRelatedProducts };
