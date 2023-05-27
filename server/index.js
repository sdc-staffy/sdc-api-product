require("dotenv").config();
const express = require("express");
const db = require('./db/db.js');

const app = express();
app.use(express.json());

const getAllProducts = async (count) => {
    const productQuery = `SELECT json_build_object('id', id, 'name', name, 'slogan', slogan, 'description', description, 'category', category, 'default_price', default_price ) as product_info
    FROM product
    GROUP BY id
    LIMIT ${count};`
    return db.query(productQuery)
        .then((response) => {
            const formatted = [];
            response.rows.forEach((row) => {
                formatted.push(row.product_info)
            })
            return formatted;
        })
        .catch((err) => console.error(err));
}
//get list of all products (default limit 5)

app.get('/products', (req, res) => {
    const count = req.query.count ? req.query.count: 5;
    getAllProducts(count)
        .then((data) => {
            res.send(data)
        })
        .catch((err)=>console.log('could not get products:', err))
})


//get one product information 
    //product info + features

/*
app.get('/products/:product_id', (req, res) => {
    const product_id = ....

     db.getProductInfo(product_id)
        .then((data) => {
            res.send(data)
        })
})
*/

//get one product's styles 

/*
app.get('/products/:product_id/styles', (req, res) => {
    const product_id = ....
    
    db.getStyleInfo(product_id)
        .then((data) => {
            res.send(data)
        })
})
*/


//get one product's related products
/*
app.get('/products/:product_id/related', (req, res) => {
    const product_id = ....

     db.getRelatedProducts(product_id)
        .then((data) => {
            res.send(data)
        })
})
*/



app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);
