//aqui es el DOM

const login = document.querySelector('#form'); //todos los elementos del DOM se pueden seleccionar con el querySelector, esto es para seleccionar el formulario de login, esto es necesario para poder escuchar el evento de submit del formulario de login, esto es necesario para poder enviar los datos del formulario de login al servidor de socket io, esto es necesario para poder autenticar al usuario en el servidor de socket io, esto es necesario para poder manejar la autenticacion en tiempo real en la aplicacion
login.addEventListener('submit', (e) => {
    e.preventDefault(); //esto es para evitar que la pagina se recargue al enviar el formulario, esto es necesario para poder manejar el envio de datos del formulario de login en tiempo real
    const user = document.querySelector('#username').value; //esto es para seleccionar el input de user, esto es necesario para poder obtener el valor del input de user, esto es necesario para poder enviar el valor del input de user al servidor de socket io, esto es necesario para poder autenticar al usuario en el servidor de socket io, esto es necesario para poder manejar la autenticacion en tiempo real en la aplicacion
    //selecciona el valor, sin value seleccion el elementos
    if (user != '') {
        document.cookie = `user=${user}; path=/`; //esto es para crear una cookie con el nombre de user y el valor del input de user, esto es necesario para poder enviar la cookie al servidor de socket io, esto es necesario para poder autenticar al usuario en el servidor de socket io, esto es necesario para poder manejar la autenticacion en tiempo real en la aplicacion
        //creamos una cookie llamada user 
        document.location.href='/'; //por que no redirecciona
    }else{
        alert('Por favor ingresa un nombre de usuario'); //esto es para mostrar una alerta si el input de user esta vacio, esto es necesario para evitar que se envie una cookie vacia al servidor de socket io, esto es necesario para evitar que se autentique un usuario sin un nombre de usuario en el servidor de socket io, esto es necesario para evitar problemas de seguridad en la aplicacion
    }

});