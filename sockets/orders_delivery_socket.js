module.exports = (io) => {
    const namespace = io.of('/orders/delivery');
    namespace.on('connection', function(socket){
        console.log('USUARIO CONECTADO A SOCKET IO');

        socket.on('position', function(data){
            console.log('SE EMITIO', JSON.parse(data));
            const d = JSON.parse(data); // debe enviarla el cliente (id, Lat, Lng) double
            namespace.emit(`position/${d.id_order}`, {id_order: d.id_order, lat: d.lat, lng: d.lng}); // data que se emite a kotlin (cliente)
        })

        socket.on('disconnect', function(data){
            console.log('EL USUARIO SE DESCONECTO DE SOCKET IO');
        })
    })
}