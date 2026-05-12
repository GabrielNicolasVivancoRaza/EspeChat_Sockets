//tenemos que crear dos servidores 


//toda la confugracion del servidor en tiempo real 
//sale la conexion para hacer la conexion bidireccional en la aplicacion 

module.exports = (httpServer) => { //configurar si peticiones http request o response 
    const {Server} = require('socket.io'); //importamos el server de socket io, bidirecciona, generamos el tunel para conexiones en tiempo real 
    const io = new Server(httpServer); //creamos el servidor de socket io, le pasamos el servidor http para que se conecte a el
    //a traves de la constante podemos accerder a la clase 
    //en el nombre de la clase server() es el constructor 
    io.on('connection', socket => {
        //cada socket que se habilita es una conexion, cada vez que se conecta un cliente se ejecuta esta funcion, el socket es la conexion del cliente
        //cada usuario tiene un socket unico, con un identificador. Vamos a mostrar por la terminal el identificador de cada socket
        // console.log('Nuevo cliente conectado', socket.id);
        //socket es lo que permite la conexion, un enlace de comunicacion
        socket.on('message', (message) => {
            const cookie = socket.request.headers.cookie; 
            const user = cookie.split('=').pop();

            io.emit('message', { //esto es para enviar el mensaje a todos los clientes conectados, esto es necesario para que todos los clientes puedan recibir el mensaje, esto es necesario para que todos los clientes puedan manejar la comunicacion en tiempo real en la aplicacion
                user: "Gabo",
                message, 
                date: new Date().getDay()
            }) 

        });
        
    })
};

//nodemon nos permite actualizar las nuevas actualizaciones sin tener que reiniciar el servidor, es decir, cada vez que guardamos un cambio en el codigo, nodemon reinicia el servidor automaticamente para que los cambios se reflejen en la aplicacion, esto es muy util para el desarrollo, ya que no tenemos que estar reiniciando el servidor manualmente cada vez que hacemos un cambio.
//real-time-server.js logica de coskets, el un server es express, el otro server es socket io
//los dos servidores trabajan de la mano 

//los servidores tenermos la conexion y escucha de eventos
//full duplex es programacion orientada a eventos, es decir, cada vez que se conecta un cliente, se ejecuta una funcion, cada vez que se desconecta un cliente, se ejecuta otra funcion, cada vez que se envia un mensaje, se ejecuta otra funcion, etc. Esto es lo que hace que la aplicacion sea en tiempo real, ya que cada vez que ocurre un evento, se ejecuta una funcion y se actualiza la aplicacion en tiempo real.
//el servidor debe empezar a escuchar los eventos, de todos los usuarios escucha como llegan los eventos 
