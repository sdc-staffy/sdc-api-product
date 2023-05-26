const { Client } = require('pg')
const fs = require('fs');
require("dotenv").config();
const path = require("path");
const { from: copyFrom } = require('pg-copy-streams');


const client = new Client({
  host: 'localhost',
  port: process.env.PORT,
  database: 'products',
  user: process.env.USER,
  password: process.env.PASSWORD
})

const createProductTable  = `
CREATE TABLE product (
    product_id INT PRIMARY KEY,
    name VARCHAR,
    slogan VARCHAR,
    description VARCHAR, 
    category VARCHAR,
    default_price INT
);
`;

const createCartTable = `
    CREATE TABLE cart (
        cart_id INT PRIMARY KEY,
        user_session INT,
        product_id INT REFERENCES product(product_id),
        active INT 
    );
`;

const createFeaturesTable = `
        CREATE TABLE features (
            features INT PRIMARY KEY,
            product_id INT REFERENCES product(product_id),
            feature VARCHAR,
            value VARCHAR
        );
`;

const createStylesTable = `
        CREATE TABLE styles (
            style_id INT PRIMARY KEY,
            product_id INT REFERENCES product(product_id),
            name VARCHAR,
            sale_price INT,
            original_price INT,
            default_style VARCHAR
        );
`;

const createSkusTable = `
        CREATE TABLE skus (
            sku_id INT PRIMARY KEY,
            styleId INT REFERENCES styles(style_id),
            size VARCHAR,
            quantity INT
        );
`;

const createPhotosTable = `
        CREATE TABLE photos (
            photo_id INT PRIMARY KEY,
            styleId INT REFERENCES styles(style_id),
            url VARCHAR,
            thumbnail_url VARCHAR
        );
`;

const setupAllTables = async () => {
    await client.query('DROP TABLE IF EXISTS photos, skus, styles, features, cart, product;');
    await client.query(createProductTable);
    await client.query(createCartTable);
    await client.query(createFeaturesTable);
    await client.query(createStylesTable);
    await client.query(createSkusTable);
    await client.query(createPhotosTable);
}

const productPath = path.join(__dirname, '../csv_files', 'product.csv');
const cartPath = path.join(__dirname, '../csv_files', 'cart.csv');
const featuresPath = path.join(__dirname, '../csv_files', 'features.csv');
const stylesPath = path.join(__dirname, '../csv_files', 'styles.csv');
const skusPath = path.join(__dirname, '../csv_files', 'skus.csv');
const photosPath = path.join(__dirname, '../csv_files', 'photos.csv');




const loadProductData = async () => {
    const stream = fs.createReadStream(productPath);
    const query = `COPY product FROM STDIN WITH (FORMAT csv, HEADER true)`;
    const copyStream = client.query(copyFrom(query));

    return new Promise((resolve, reject) => {
        stream
            .pipe(copyStream)
            .on('finish', resolve)
            .on('error', reject)
    })
}

const loadCartData = async () => {
    const stream = fs.createReadStream(cartPath);
    const query = `COPY cart FROM STDIN WITH (FORMAT csv, HEADER true)`;
    const copyStream = client.query(copyFrom(query));

    return new Promise((resolve, reject) => {
        stream
            .pipe(copyStream)
            .on('finish', resolve)
            .on('error', reject)
    })
}

const loadFeaturesData = async () => {
    const stream = fs.createReadStream(featuresPath);
    const query = `COPY features FROM STDIN WITH (FORMAT csv, HEADER true)`;
    const copyStream = client.query(copyFrom(query));

    return new Promise((resolve, reject) => {
        stream
            .pipe(copyStream)
            .on('finish', resolve)
            .on('error', reject)
    })
}

const loadStylesData = async () => {
    const stream = fs.createReadStream(stylesPath);
    const query = `COPY styles FROM STDIN WITH (FORMAT csv, NULL 'null', HEADER true)`;
    const copyStream = client.query(copyFrom(query));

    return new Promise((resolve, reject) => {
        stream
            .pipe(copyStream)
            .on('finish', resolve)
            .on('error', reject)
    })
}

const loadSkusData = async () => {
    const stream = fs.createReadStream(skusPath);
    const query = `COPY skus FROM STDIN WITH (FORMAT csv, HEADER true)`;
    const copyStream = client.query(copyFrom(query));

    return new Promise((resolve, reject) => {
        stream
            .pipe(copyStream)
            .on('finish', resolve)
            .on('error', reject)
    })
}

const loadPhotosData = async () => {
    const stream = fs.createReadStream(photosPath);
    const query = `COPY photos FROM STDIN WITH (FORMAT csv, HEADER true)`;
    const copyStream = client.query(copyFrom(query));

    return new Promise((resolve, reject) => {
        stream
            .pipe(copyStream)
            .on('finish', resolve)
            .on('error', reject)
    })
}


const loadAllData = async () => {
    await loadProductData();
    console.log("---> Completed product Dataload")
    await loadCartData();
    console.log("---> Completed cart Dataload")
    await loadFeaturesData();
    console.log("---> Completed features Dataload")
    await loadStylesData();
    console.log("---> Completed styles Dataload")
    await loadSkusData();
    console.log("---> Completed skus Dataload")
    await loadPhotosData();
    console.log("---> Completed photos Dataload")
}

const run = async () => {
    try {
        await client.connect();
        console.time("setupAllTables");
        await setupAllTables();
        console.timeEnd("setupAllTables");

        console.time("loadAllData");
        await loadAllData();
        console.timeEnd("loadAllData");
        console.log('Data loaded successfully');
        await client.end();
    } catch (err) {
        console.error(err);
        await client.end();
    }
}

run();
