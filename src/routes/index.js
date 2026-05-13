//debemos crear un listado de todas las rutas
//desde el index navegamos por todas las rutas 
//un solo archivo conecta todas las rutas 

const express = require('express'); //crear el sistema de rutas de exores
const router = express.Router(); 
//el ssitemas de rutas debe buscarse en un directorio especifico (routes)

const path = require('path'); //ruta raiz dentro de src
//ya esta listo el sistema de rutas de express 
const isLoggedIn = require("../middleware/isLoggedIn");

const views = path.join(__dirname, '/../views'); 

router.get('/', (req, res) => { //cuando se accede a la ruta raiz, se ejecuta esta funcion, req es la peticion, res es la respuesta
    //solo con el / busca el index, busca por defecto
    res.sendFile(views + '/index.html');
});

router.get('/register', (req, res) => {
    res.sendFile(views + '/register.html');
});

module.exports = router; //exportamos el router para que pueda ser usado en el index.js, es decir, para que pueda ser usado en la aplicacion de express, esto es necesario para que el servidor de socket io pueda conectarse a el


// document object model DOM -- se basa en el html
// objetos son etiquetas html y tienen atributos y metodos
//js manipula el DOM osea las etiquetas como objetos 
//addEventListener es un metodo que permite escuchar eventos