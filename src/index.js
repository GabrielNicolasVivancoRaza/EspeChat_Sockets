const express = require('express');
const {createServer} = require('http'); 
const realTimeServer = require('./realTimeServer'); 
const path = require('path'); //ruta raiz dentro de src
const cookieParser = require("cookie-parser");


const app = express();  //creamos la aplicacion de express, esto es lo que se va a ejecutar, es el servidor de express, es el que va a manejar las rutas, las vistas, etc
const httpServer = createServer(app); //creamos el servidor http, le pasamos la aplicacion de express, esto es para que el servidor http pueda manejar las peticiones de express, esto es necesario para que el servidor de socket io pueda conectarse a el

//creamos para puerto 
app.set('port', process.env.PORT || 3000); // .env es para las variables de entorno 
//puerto por defecto en node es el 3000

//vamos a decirle donde estan los directorios
app.set('views',path.join(__dirname, 'views' )); //usamos el path, esto pa las vistas directamente 
app.use(cookieParser());

app.use(require("./routes")); //requiero usar una ruta, siempre busa el index.js por defecto

app.use(express.static(path.join(__dirname, 'public'))); //esto es para los archivos estaticos, como css, js, imagenes, etc

httpServer.listen(app.get('port'), () => { //a traves del puerto que vamos a necesitar para conectarnos. funciona anomima o closure, funcion sin nombre
    console.log('Servidor en puerto', app.get('port'));
});

realTimeServer(httpServer); //httpserver es nuestra aplicacion que esta corriendo en el server 

//a traves de las rutas



//git add .
//git commit -m "mensaje del commit"
//git branch -m main
//git remote add origin link del repositorio
//git push -u origin main