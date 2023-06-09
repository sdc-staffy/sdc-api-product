const { Client } = require('pg')
const fs = require('fs');
require("dotenv").config();
const path = require("path");
const { from: copyFrom } = require('pg-copy-streams');


const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDB,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
})

const createProductTable  = `
CREATE TABLE product (
    id INT PRIMARY KEY,
    name VARCHAR,
    slogan VARCHAR,
    description VARCHAR, 
    category VARCHAR,
    default_price INT
);
CREATE INDEX product_index ON product (id);
`;

const createRelatedTable = `
CREATE TABLE related (
    related_id INT PRIMARY KEY,
    current_product_id INT REFERENCES product(id),
    related_product_id INT 
);
CREATE INDEX relatedProductId_index ON related (current_product_id);
`;

const createFeaturesTable = `
        CREATE TABLE features (
            features INT PRIMARY KEY,
            product_id INT REFERENCES product(id),
            feature VARCHAR,
            value VARCHAR
        );
        CREATE INDEX featuresProductId_index ON features (product_id);
`;

const createStylesTable = `
        CREATE TABLE styles (
            style_id INT PRIMARY KEY,
            product_id INT REFERENCES product(id),
            name VARCHAR,
            sale_price INT,
            original_price INT,
            default_style VARCHAR
        );
        CREATE INDEX styleid_index ON styles (style_id);
        CREATE INDEX styleProductId_index ON styles(product_id);
`;

const createSkusTable = `
        CREATE TABLE skus (
            sku_id INT PRIMARY KEY,
            styleId INT REFERENCES styles(style_id),
            size VARCHAR,
            quantity INT
        );
        CREATE INDEX skus_styleid_index ON skus (styleId);
`;

const createPhotosTable = `
        CREATE TABLE photos (
            photo_id INT PRIMARY KEY,
            styleId INT REFERENCES styles(style_id),
            url VARCHAR,
            thumbnail_url VARCHAR
        );
        CREATE INDEX photos_styleid_index ON photos (styleId);
`;

const setupAllTables = async () => {
    try {
        await client.query('DROP TABLE IF EXISTS photos, skus, styles, features, related, product;');
        console.log('---> ALL TABLES DROPPED');
        await client.query(createProductTable);
        await client.query(createRelatedTable);
        await client.query(createFeaturesTable);
        await client.query(createStylesTable);
        await client.query(createSkusTable);
        await client.query(createPhotosTable);
    } catch (err) {
        console.error("Error setting up tables: ", err);
    }
}

const productPath = path.join(__dirname, '../../csv_files', 'product.csv');
const relatedPath = path.join(__dirname, '../../csv_files', 'related.csv');
const featuresPath = path.join(__dirname, '../../csv_files', 'features.csv');
const stylesPath = path.join(__dirname, '../../csv_files', 'styles.csv');
const skusPath = path.join(__dirname, '../../csv_files', 'skus.csv');
const photosPath = path.join(__dirname, '../../csv_files', 'photos.csv');

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

const loadRelatedData = async () => {
    const stream = fs.createReadStream(relatedPath);
    const query = `COPY related FROM STDIN WITH (FORMAT csv, HEADER true)`;
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
    try {
        await loadProductData();
        console.log("---> Completed product Dataload")
        await loadRelatedData();
        console.log("---> Completed related Dataload")
        await loadFeaturesData();
        console.log("---> Completed features Dataload")
        await loadStylesData();
        console.log("---> Completed styles Dataload")
        await loadSkusData();
        console.log("---> Completed skus Dataload")
        await loadPhotosData();
        console.log("---> Completed photos Dataload")
    } catch (err) {
        console.error("Error loading tables: ", err);
    }
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