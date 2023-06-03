const db = require('./db/db.js');

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

const getStyleInfo = async (product_id) => {
    const styleInfoQuery = `
    SELECT json_build_object(
        'product_id', styles.product_id, 
        'results', json_agg(
            json_build_object(
              'style_id', style_id,
              'name', name,
              'original_price', original_price,
              'sale_price', sale_price,
              'default?', CASE WHEN default_style::integer = 1 THEN true ELSE false END,
              'photos', photos_agg,
              'skus', skus_agg
          )
        ) 
      ) as styles_info
      FROM styles
      LEFT JOIN (
          SELECT styleid, json_agg(
              json_build_object(
                  'thumbnail_url', thumbnail_url,
                  'url', url
              )) as photos_agg
          FROM photos
          GROUP BY styleid
          ) photos ON styles.style_id = photos.styleid
      LEFT JOIN (
          SELECT styleid, json_agg(
              json_build_object(
                  sku_id, json_build_object(
                      'quantity', quantity,
                      'size', size 
                  )
              )
          ) as skus_agg
          FROM skus
          GROUP BY styleid
      ) skus ON styles.style_id = skus.styleid
      WHERE styles.product_id = ${product_id}
      GROUP BY styles.product_id;      
    `
    try {
        const response = await db.query(styleInfoQuery);
        return response.rows[0].styles_info;
    } catch (err) {
        return console.error(err);
    }
}

const getRelatedProducts = async (product_id) => {
    const relatedQuery = `
        SELECT json_agg(related_product_id) as related_info
        FROM related
        WHERE current_product_id = ${product_id}
    `

    try {
        const response = await db.query(relatedQuery);
        return response.rows[0].related_info

    } catch (err) {
        return console.error(err);
    }
}

module.exports = {getAllProducts, getProductInfo, getStyleInfo, getRelatedProducts};