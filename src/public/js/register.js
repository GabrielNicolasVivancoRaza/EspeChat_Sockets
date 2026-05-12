//aqui es el DOM

const login = document.querySelector('#login'); //todos los elementos del DOM se pueden seleccionar con el querySelector, esto es para seleccionar el formulario de login, esto es necesario para poder escuchar el evento de submit del formulario de login, esto es necesario para poder enviar los datos del formulario de login al servidor de socket io, esto es necesario para poder autenticar al usuario en el servidor de socket io, esto es necesario para poder manejar la autenticacion en tiempo real en la aplicacion
login.addEventListener('click', () => {
    const user = document.querySelector('#username').value; //esto es para seleccionar el input de user, esto es necesario para poder obtener el valor del input de user, esto es necesario para poder enviar el valor del input de user al servidor de socket io, esto es necesario para poder autenticar al usuario en el servidor de socket io, esto es necesario para poder manejar la autenticacion en tiempo real en la aplicacion
    //selecciona el valor, sin value seleccion el elementos
    if (user != '') {
        document.cookie = `username=${user}`; //esto es para crear una cookie con el nombre de username y el valor del input de user, esto es necesario para poder enviar la cookie al servidor de socket io, esto es necesario para poder autenticar al usuario en el servidor de socket io, esto es necesario para poder manejar la autenticacion en tiempo real en la aplicacion
        //creamos una cookie llamada username 
        document.location.href='/'; //por que no redirecciona
    }else{
        alert('Por favor ingresa un nombre de usuario'); //esto es para mostrar una alerta si el input de user esta vacio, esto es necesario para evitar que se envie una cookie vacia al servidor de socket io, esto es necesario para evitar que se autentique un usuario sin un nombre de usuario en el servidor de socket io, esto es necesario para evitar problemas de seguridad en la aplicacion
    }

});