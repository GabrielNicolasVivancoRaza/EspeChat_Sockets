/**
 * @file constants.js
 * @description Centraliza todas las constantes de la aplicación
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: DRY (Don't Repeat Yourself)
 * Las constantes magic numbers y strings están centralizadas
 * para facilitar mantenimiento y cambios globales
 */

const APPLICATION_CONSTANTS = {
  // CONFIGURACIÓN DE SERVIDOR
  SERVER: {
    DEFAULT_PORT: 3000,
    HOST: 'localhost',
  },

  // CONFIGURACIÓN DE SOCKET IO
  SOCKET_IO: {
    ANONYMOUS_USER: 'Anónimo',
    CONNECTION_TIMEOUT: 45000,
  },

  // TIPOS DE MENSAJES
  MESSAGE_TYPES: {
    TEXT: 'text',
    PHOTO: 'photo',
    SYSTEM: 'system',
  },

  // EVENTOS DE SOCKET
  SOCKET_EVENTS: {
    // Eventos del cliente
    MESSAGE: 'message',
    PHOTO: 'photo',
    EDIT_MESSAGE: 'editMessage',
    DELETE_MESSAGE: 'deleteMessage',
    TYPING: 'typing',
    STOP_TYPING: 'stopTyping',
    
    // Eventos del servidor
    LOAD_MESSAGES: 'loadMessages',
    MESSAGE_RECEIVED: 'message',
    MESSAGE_EDITED: 'messageEdited',
    MESSAGE_DELETED: 'messageDeleted',
    USER_TYPING: 'userTyping',
    USER_STOP_TYPING: 'userStopTyping',
  },

  // COOKIES
  COOKIES: {
    USER_KEY: 'user',
    COOKIE_SEPARATOR: ';',
    COOKIE_PAIR_SEPARATOR: '=',
  },

  // VALIDACIÓN
  VALIDATION: {
    MAX_MESSAGE_LENGTH: 1000,
    MIN_MESSAGE_LENGTH: 1,
    MAX_USERNAME_LENGTH: 50,
    MIN_USERNAME_LENGTH: 2,
  },

  // RUTAS
  ROUTES: {
    HOME: '/',
    REGISTER: '/register',
    IO_TEST: '/io-test',
    CPU_BLOCK: '/cpu-block',
  },

  // CÓDIGO HTTP
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
};

module.exports = APPLICATION_CONSTANTS;
