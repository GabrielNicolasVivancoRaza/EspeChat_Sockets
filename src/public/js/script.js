const socket = io(); //esto es para crear la conexion con el servidor de socket io, esto es necesario para que el cliente pueda conectarse al servidor de socket io, esto es lo que permite la comunicacion en tiempo real entre el cliente y el servidor de socket io
//solo para utilizar el metodo io de socket 
const send = document.querySelector('#send-message'); //esto es para seleccionar el boton de enviar, esto es necesario para poder escuchar el evento de click del boton de enviar, esto es necesario para poder enviar el mensaje al servidor de socket io, esto es necesario para poder manejar la comunicacion en tiempo real en la aplicacion
const allMessages = document.querySelector('#all-messages'); //esto es para seleccionar el contenedor de mensajes, esto es necesario para poder mostrar los mensajes en el contenedor de mensajes, esto es necesario para poder manejar la comunicacion en tiempo real en la aplicacion

send.addEventListener('click', () => {
    const message = document.querySelector('#message').value; //esto es para seleccionar el input de mensaje, esto es necesario para poder obtener el valor del input de mensaje, esto es necesario para poder enviar el valor del input de mensaje al servidor de socket io, esto es necesario para poder manejar la comunicacion en tiempo real en la aplicacion
    //vamos a mandar a la lista de all mesages 
    //eliminar mensaje
    message.value = ''; //esto es para limpiar el input de mensaje, esto es necesario para que el usuario pueda escribir un nuevo mensaje, esto es necesario para mejorar la experiencia de usuario en la aplicacion
    socket.emit("message", message); //esto es para enviar el mensaje al servidor de socket io, esto es necesario para que el servidor de socket io pueda recibir el mensaje, esto es necesario para que el servidor de socket io pueda manejar la comunicacion en tiempo real en la aplicacion
    //tenemos que ahora enviar el mensaje 
    //el evento ejecuta la toma del valor del mensaje



});

socket.on("message", ({user, message, date}) => {
    const msg = document.createRange().createContextualFragment(`
        <div class="message">
            <div class="image-container">
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User Image">
            </div>
            <div class="message-body">
                <div class="user-info">
                    <span class="username">${user}</span>
                    <span class="time">${date}</span>
                    <p>
                    ${message}
                    </p>
                </div>
            </div>
        </div>
        `); //fragment es meter el html para que lo entienda
        allMessages.append(msg);
}) //evento universal o global