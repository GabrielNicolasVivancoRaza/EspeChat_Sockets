const socket = io();
const send = document.querySelector('#send-message');
const sendPhoto = document.querySelector('#send-photo');
const photoInput = document.querySelector('#photo-input');
const allMessages = document.querySelector('#all-messages');
const messageInput = document.querySelector('#message');
const typingIndicator = document.querySelector('#typing-indicator');

let typingTimeout; // Para controlar el timeout de escritura
let isTyping = false; // Bandera para saber si está escribiendo
let editingMessageId = null; // Para saber si estamos editando un mensaje

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

// Función para crear el elemento del mensaje
function createMessageElement(messageData) {
    const currentUser = getCurrentUser();
    const isCurrentUserMessage = messageData.user === currentUser;
    
    let messageContent;
    if (messageData.type === 'photo') {
        messageContent = `<img src="${messageData.message}" alt="Foto" style="max-width: 300px; max-height: 300px; border-radius: 8px; margin-top: 8px;">`;
    } else {
        messageContent = `<p>${messageData.message}${messageData.edited ? ' <em style="font-size: 0.8em; color: #888;">(editado)</em>' : ''}</p>`;
    }
    
    // Solo permitir editar mensajes de texto, no fotos
    const actionButtons = isCurrentUserMessage ? `
        <div class="message-actions">
            ${messageData.type === 'text' ? `<button class="edit-btn" data-id="${messageData.id}" title="Editar mensaje">✏️</button>` : ''}
            <button class="delete-btn" data-id="${messageData.id}" title="Eliminar mensaje">🗑️</button>
        </div>
    ` : '';
    
    const msg = document.createRange().createContextualFragment(`
        <div class="message" data-message-id="${messageData.id}">
            <div class="image-container">
                <img src="/img/gaborabo.jpeg" alt="User Image">
            </div>
            <div class="message-body">
                <div class="user-info">
                    <span class="username">${messageData.user}</span>
                    <span class="time">${messageData.date}</span>
                </div>
                ${messageContent}
                ${actionButtons}
            </div>
        </div>
    `);
    
    // Agregar event listeners a los botones de acción
    const editBtn = msg.querySelector('.edit-btn');
    const deleteBtn = msg.querySelector('.delete-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => editMessage(messageData));
    }
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteMessage(messageData.id));
    }
    
    return msg;
}

// Función para editar un mensaje
function editMessage(messageData) {
    editingMessageId = messageData.id;
    messageInput.value = messageData.message;
    messageInput.focus();
    send.textContent = 'Guardar';
}

// Función para cancelar la edición
function cancelEdit() {
    editingMessageId = null;
    messageInput.value = '';
    send.textContent = 'Enviar';
}

// Función para eliminar un mensaje
function deleteMessage(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
        socket.emit('deleteMessage', id);
    }
}

// Evento para enviar foto
sendPhoto.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona solo archivos de imagen');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            socket.emit('photo', event.target.result); // Enviar como base64
            photoInput.value = ''; // Limpiar el input
        };
        reader.readAsDataURL(file);
    }
});

// Evento para enviar mensaje
send.addEventListener('click', () => {
    const message = messageInput.value.trim();
    
    if (message === '') {
        alert('Por favor escribe un mensaje antes de enviar');
        return;
    }
    
    if (editingMessageId) {
        // Editar mensaje existente
        socket.emit('editMessage', { messageId: editingMessageId, newMessage: message });
        editingMessageId = null; // Resetear el ID de edición
        send.textContent = 'Enviar'; // Cambiar el botón de vuelta a "Enviar"
    } else {
        // Enviar nuevo mensaje
        socket.emit("message", message);
    }
    
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
    // Cancelar edición con Escape
    if (e.key === 'Escape' && editingMessageId) {
        cancelEdit();
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

// Cargar mensajes previos
socket.on('loadMessages', (prevMessages) => {
    allMessages.innerHTML = '';
    prevMessages.forEach(messageData => {
        const msg = createMessageElement(messageData);
        allMessages.append(msg);
    });
    // Auto-scroll al último mensaje
    allMessages.scrollTop = allMessages.scrollHeight;
});

// Recibir nuevo mensaje
socket.on("message", (messageData) => {
    const currentUser = getCurrentUser();
    const msg = createMessageElement(messageData);
    allMessages.append(msg);
    
    // Reproducir sonido solo si el mensaje NO es del usuario actual
    if (messageData.user !== currentUser) {
        playNotificationSound();
    }
    
    // Auto-scroll al último mensaje
    allMessages.scrollTop = allMessages.scrollHeight;
});

// Escuchar cuando se edita un mensaje
socket.on('messageEdited', (messageData) => {
    const messageElement = document.querySelector(`[data-message-id="${messageData.id}"]`);
    if (messageElement) {
        // Remover el elemento anterior
        messageElement.remove();
        // Crear y agregar el mensaje actualizado
        const updatedMsg = createMessageElement(messageData);
        allMessages.append(updatedMsg);
        allMessages.scrollTop = allMessages.scrollHeight;
    }
});

// Escuchar cuando se elimina un mensaje
socket.on('messageDeleted', (messageId) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
        messageElement.remove();
    }
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