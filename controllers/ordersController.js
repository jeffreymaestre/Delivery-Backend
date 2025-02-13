const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const timeRelative = require('../utils/time.relative');

module.exports = {

    //TEST PARA OBTENER EL TOTAL DEL DIA
    async totalOrders(req, res, next){
        try {
            //const status = req.params.status;
            let data = await Order.totalOrders();

            /*data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), new Date(d.order_date).getTime());
            });*/

            console.log('Order: ', data[0]);

            return res.status(201).json({success: true,
                message: "Orden encontrada",
                data: data[0]});
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando las ordenes por estado',
                error: error
            });
        }
    },

    async findByStatus(req, res, next){
        try {
            const status = req.params.status;
            let data = await Order.findByStatus(status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp)
            });

            console.log('Order: ', data);

            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando las ordenes por estado',
                error: error
            });
        }
    },

    async findByClientAndStatus(req, res, next){
        try {
            const status = req.params.status;
            const id_client = req.params.id_client;
            let data = await Order.findByClientAndStatus(id_client, status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp)
            });

            console.log('Order: ', data);

            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando las ordenes por estado',
                error: error
            });
        }
    },

    async findByDeliveryAndStatus(req, res, next){
        try {
            const status = req.params.status;
            const id_delivery = req.params.id_delivery;
            let data = await Order.findByDeliveryAndStatus(id_delivery, status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp)
            });

            console.log('Order: ', data);

            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando las ordenes por estado',
                error: error
            });
        }
    },


    async create(req, res, next){
        try {
            const order = req.body;
            const data = await Order.create(order);
            
            //Recorremos todos los productos agregados a la orden
            for(const product of order.products){
                await OrderHasProducts.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data: {
                    'id': data.id
                }
            });
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },

    async updateToDispatched(req, res, next){
        try {
            let order = req.body;
            order.status = 'DESPACHADO';
            await Order.update(order);
            
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente'
            });
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },

    async updateToOnTheWay(req, res, next){
        try {
            let order = req.body;
            order.status = 'EN CAMINO';
            await Order.update(order);
            
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente'
            });
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },

    async updateToDelivery(req, res, next){
        try {
            let order = req.body;
            order.status = 'ENTREGADO';
            await Order.update(order);
            
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente'
            });
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },

    async updateLatLng(req, res, next){
        try {
            let order = req.body;
            await Order.updateLatLng(order);
            
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente'
            });
        } catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    }
}