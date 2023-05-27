require("dotenv").config();
const express = require("express");
const db = require('./db/db.js');

const app = express();
app.use(express.json());

const getAllProducts = async (count) => {
    const productQuery = `SELECT json_build_object(
        'id', id, 
        'name', name, 
        'slogan', slogan, 
        'description', description, 
        'category', category, 
        'default_price', default_price ) as product_info
        FROM product
        GROUP BY id
        LIMIT ${count};`
    try {
        const response = await db.query(productQuery);
        const formatted = [];
        response.rows.forEach((row) => {
            formatted.push(row.product_info);
        });
        return formatted;
    } catch (err) {
        return console.error(err);
    }
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

const getProductInfo = async (product_id) => {
    const productInfoQuery = `SELECT json_build_object(
        'id', product.id, 
        'name', product.name, 
        'slogan', product.slogan, 
        'description', product.description, 
        'category', product.category, 
        'default_price', product.default_price, 
        'features', json_agg(
          json_build_object(
            'feature', features.feature, 
            'value', features.value
          )
        )
      ) as product_info
      FROM product
      RIGHT JOIN features ON product.id = features.product_id
      WHERE product.id = ${product_id}
      GROUP BY product.id;`
    
    try {
        const response = await db.query(productInfoQuery);
        return response.rows[0].product_info;
    } catch (err) {
        return console.error(err);
    }
}

//get one product information 

app.get('/products/:product_id', (req, res) => {
    const product_id = Number.parseInt(req.params.product_id)

     getProductInfo(product_id)
        .then((data) => {
            res.send(data)
        })
        .catch((err)=>console.log('could not get products:', err))
})

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
