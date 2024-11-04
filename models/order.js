const db = require('../config/config');

const Order = {};

Order.findByClientAndStatus = (id_client, status) => {
    const sql = 
    `SELECT
        o.id,
        o.id_client,
        o.id_address,
        o.id_delivery,
        o.status,
        o.timestamp,
        o.lat,
        o.lng,
		JSON_AGG(
		 JSON_BUILD_OBJECT(
		 	'id', P.id,
			 'name', P.name,
			 'description', P.description,
			 'price', P.price,
			 'image1', P.image1,
			 'image2', P.image2,
			 'quantity', OHP.quantity
		 )
		) AS products,
        JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'lastname', u.lastname,
            'image', u.image
            ) AS client,
         JSON_BUILD_OBJECT(
            'id', a.id,
            'address', a.address,
            'neighborhood', a.neighborhood,
            'lat', a.lat,
            'lng', a.lng
            ) AS address
    FROM
        orders AS o
    INNER JOIN
        users AS U
    ON
        o.id_client = u.id
    INNER JOIN
        address AS a
    ON
        a.id = o.id_address
	INNER JOIN
		order_has_products AS OHP
	ON
		OHP.id_order = o.id
	INNER JOIN 
		products AS P
	ON
		P.id = OHP.id_product
	
    WHERE
        o.id_client = $1 AND status = $2
	GROUP BY
	    o.id, U.id, a.id;
    `;

    return db.manyOrNone(sql, [id_client, status]);
}

Order.findByStatus = (status) => {
    const sql = 
    `SELECT
        o.id,
        o.id_client,
        o.id_address,
        o.id_delivery,
        o.status,
        o.timestamp,
        o.lat,
        o.lng,
		JSON_AGG(
		 JSON_BUILD_OBJECT(
		 	'id', P.id,
			 'name', P.name,
			 'description', P.description,
			 'price', P.price,
			 'image1', P.image1,
			 'image2', P.image2,
			 'quantity', OHP.quantity
		 )
		) AS products,
        JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'lastname', u.lastname,
            'image', u.image
            ) AS client,
         JSON_BUILD_OBJECT(
            'id', a.id,
            'address', a.address,
            'neighborhood', a.neighborhood,
            'lat', a.lat,
            'lng', a.lng
            ) AS address
    FROM
        orders AS o
    INNER JOIN
        users AS U
    ON
        o.id_client = u.id
    INNER JOIN
        address AS a
    ON
        a.id = o.id_address
	INNER JOIN
		order_has_products AS OHP
	ON
		OHP.id_order = o.id
	INNER JOIN 
		products AS P
	ON
		P.id = OHP.id_product
	
    WHERE
        status = $1
	GROUP BY
	    o.id, U.id, a.id;
    `;

    return db.manyOrNone(sql, status);
}

Order.create = (order) => {
    const sql = `
    INSERT INTO
        orders(
            id_client,
            id_address,
            status,
            timestamp,
            created_at,
            updated_at
        )
            VALUES($1, $2, $3, $4, $5, $6) RETURNING id
    `;

    return db.oneOrNone(sql, [
        order.id_client,
        order.id_address,
        order.status,
        Date.now(),
        new Date(),
        new Date()
    ]);
}

module.exports = Order;