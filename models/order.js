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
            'id', U.id,
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image
            ) AS client,
			 JSON_BUILD_OBJECT(
            'id', U2.id,
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image
            ) AS delivery,
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
	LEFT JOIN
		users AS U2	
	ON
		o.id_delivery = U2.id
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
	    o.id, U.id, a.id, U2.id
    ORDER BY 
        o.timestamp DESC
    `;

    return db.manyOrNone(sql, [id_client, status]);
}

Order.findByDeliveryAndStatus = (id_delivery, status) => {
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
            'id', U.id,
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image
            ) AS client,
			 JSON_BUILD_OBJECT(
            'id', U2.id,
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image
            ) AS delivery,
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
	LEFT JOIN
		users AS U2	
	ON
		o.id_delivery = U2.id
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
        o.id_delivery = $1 AND status = $2
	GROUP BY
	    o.id, U.id, a.id, U2.id
    ORDER BY 
        o.timestamp DESC
    `;

    return db.manyOrNone(sql, [id_delivery, status]);
}

//TEST PARA OBTENER EL TOTAL DE ORDENES DEL DIA - LA SUMATORIA
Order.totalOrders = (status) => {
    const sql = 
    `SELECT 
    DATE(o.created_at) AS order_date,
    SUM(p.price * ohp.quantity) AS total
FROM 
    orders o
JOIN 
    order_has_products ohp ON o.id = ohp.id_order
JOIN 
    products p ON ohp.id_product = p.id
WHERE 
    DATE(o.created_at) = CURRENT_DATE
GROUP BY 
    DATE(o.created_at);
    `;

    return db.manyOrNone(sql);
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
            'id', U.id,
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image
            ) AS client,
			 JSON_BUILD_OBJECT(
            'id', U2.id,
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image
            ) AS delivery,
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
	LEFT JOIN
		users AS U2	
	ON
		o.id_delivery = U2.id
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
	    o.id, U.id, a.id, U2.id
    ORDER BY 
        o.timestamp DESC
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

Order.update = (order) => {
    const sql = `
    UPDATE
        orders
    SET
        id_client = $2,
        id_address = $3,
        id_delivery = $4,
        status = $5,
        updated_at = $6
    WHERE
        id = $1
        `;
return db.none(sql, [
    order.id,
    order.id_client,
    order.id_address,
    order.id_delivery,
    order.status,
    new Date()
]);
}

Order.updateLatLng = (order) => {
    const sql = `
        UPDATE
            orders
        SET
            lat = $2,
            lng = $3
        WHERE
            id = $1
    `;

    return db.none(sql, [
        order.id,
        order.lat,
        order.lng
    ]);
}

module.exports = Order;