const socket = io();
const send = document.querySelector('#send-message');
const allMessages = document.querySelector('#all-messages');
const messageInput = document.querySelector('#message');
const typingIndicator = document.querySelector('#typing-indicator');

let typingTimeout; // Para controlar el timeout de escritura
let isTyping = false; // Bandera para saber si está escribiendo

// Obtener el usuario actual de las cookies
function getCurrentUser() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'user') {
            return decodeURIComponent(value);
        }
    }
    return 'Tú';
}

// Función para reproducir sonido de notificación
function playNotificationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    // Sonido: frecuencia 800Hz, duración 200ms
    oscillator.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

send.addEventListener('click', () => {
    const message = messageInput.value.trim();
    
    if (message === '') {
        alert('Por favor escribe un mensaje antes de enviar');
        return;
    }
    
    socket.emit("message", message);
    messageInput.value = '';
    
    // Dejar de escribir cuando se envía
    isTyping = false;
    clearTimeout(typingTimeout);
    socket.emit('stopTyping');
});

// Permitir enviar mensaje con Enter
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        send.click();
    }
});

// Detectar cuando el usuario comienza a escribir
messageInput.addEventListener('input', () => {
    if (messageInput.value.trim() !== '') {
        if (!isTyping) {
            isTyping = true;
            socket.emit('typing'); // Emitir que está escribiendo
        }
        // Reiniciar el timeout cada vez que teclea
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping = false;
            socket.emit('stopTyping'); // Emitir que dejó de escribir
        }, 1000); // 1 segundo sin escribir
    }
});

socket.on("message", ({user, message, date}) => {
    const currentUser = getCurrentUser();
    const msg = document.createRange().createContextualFragment(`
        <div class="message">
            <div class="image-container">
                <img src="/img/gaborabo.jpeg" alt="User Image">
            </div>
            <div class="message-body">
                <div class="user-info">
                    <span class="username">${user}</span>
                    <span class="time">${date}</span>
                </div>
                <p>${message}</p>
            </div>
        </div>
    `);
    allMessages.append(msg);
    
    // Reproducir sonido solo si el mensaje NO es del usuario actual
    if (user !== currentUser) {
        playNotificationSound();
    }
    
    // Auto-scroll al último mensaje
    allMessages.scrollTop = allMessages.scrollHeight;
});

// Escuchar cuando otro usuario está escribiendo
socket.on('userTyping', ({user}) => {
    typingIndicator.textContent = `${user} está escribiendo...`;
    typingIndicator.style.display = 'block';
});

// Escuchar cuando otro usuario deja de escribir
socket.on('userStopTyping', () => {
    typingIndicator.textContent = '';
    typingIndicator.style.display = 'none';
});