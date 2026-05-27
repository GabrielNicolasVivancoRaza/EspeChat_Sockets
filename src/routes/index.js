//debemos crear un listado de todas las rutas
//desde el index navegamos por todas las rutas 
//un solo archivo conecta todas las rutas 

const express = require('express'); //crear el sistema de rutas de exores
const router = express.Router(); 
//el ssitemas de rutas debe buscarse en un directorio especifico (routes)

const path = require('path'); //ruta raiz dentro de src
const fs = require('fs'); // Módulo para operaciones de I/O
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

/**
 * @route GET /io-test
 * @description Endpoint para demostrar la concurrencia de I/O (no bloqueante).
 * Lee un archivo de forma asíncrona sin bloquear el Event Loop.
 * Esto permite que otras peticiones se procesen mientras se lee el archivo.
 */
router.get('/io-test', (req, res) => {
    // Obtenemos la ruta absoluta al package.json
    const filePath = path.join(__dirname, '..', '..', 'package.json');
    
    // fs.readFile es una operación de I/O ASÍNCRONA.
    // Node.js delega la lectura al sistema operativo y el callback
    // se encolará en la Macrotask Queue cuando la lectura termine.
    // Mientras tanto, el Event Loop sigue libre para atender otras peticiones.
    // Esto demuestra el modelo non-blocking I/O de Node.js
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al leer el archivo.');
        }
        res.type('json').send(data);
    });
});

/**
 * @route GET /cpu-block
 * @description Endpoint para demostrar el bloqueo del Event Loop.
 * Realiza un cálculo síncrono intensivo que acapara la CPU.
 * ADVERTENCIA: Mientras se ejecuta, el Event Loop está completamente bloqueado
 * y NO puede procesar NINGUNA otra petición (ni del chat, ni de I/O, ni nada).
 */
router.get('/cpu-block', (req, res) => {
    // Esta función es SÍNCRONA y pesada.
    // Mientras se ejecuta, el Event Loop está completamente bloqueado
    // y no puede procesar NINGUNA otra petición (ni del chat, ni de I/O, etc).
    // El hilo principal está 100% ocupado haciendo cálculos.
    const resultado = calcularFibonacci(40);
    res.send(`El resultado del cálculo intensivo es: ${resultado}`);
});

/**
 * Función auxiliar para simular trabajo de CPU intensivo.
 * Calcula recursivamente el número de Fibonacci.
 * Con fib(40), esto tarda varios segundos y bloquea completamente el servidor.
 * @param {number} num - El número de Fibonacci a calcular
 * @returns {number} El número de Fibonacci calculado
 */
function calcularFibonacci(num) {
    if (num <= 1) return 1;
    return calcularFibonacci(num - 1) + calcularFibonacci(num - 2);
}

module.exports = router;