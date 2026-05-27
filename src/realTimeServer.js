/**
 * @file realTimeServer.js
 * @description Configuración de Socket.IO para comunicación en tiempo real
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * ARQUITECTURA: Event-Driven Architecture
 * Implementa el patrón Observer para comunicación bidireccional
 * 
 * PRINCIPIOS APLICADOS:
 * - Separation of Concerns: Lógica de eventos separada de rutas
 * - DRY: Uso de constantes y funciones reutilizables
 * - SOLID: Inyección de dependencias (MessageService)
 * - Resiliencia: Manejo de errores en cada evento
 */

const MessageService = require('./services/messageService');
const CookieParserUtility = require('./utils/cookieParser');
const MessageValidator = require('./validators/messageValidator');
const logger = require('./utils/logger');
const CONSTANTS = require('./config/constants');
const ENVIRONMENT_CONFIG = require('./config/environment');

module.exports = (httpServer) => {
  const { Server } = require('socket.io');

  // Configurar Socket.IO con opciones de resiliencia
  const io = new Server(httpServer, {
    cors: ENVIRONMENT_CONFIG.SOCKET_IO.CORS,
    reconnection: ENVIRONMENT_CONFIG.SOCKET_IO.RECONNECTION,
    reconnectionDelay: ENVIRONMENT_CONFIG.SOCKET_IO.RECONNECTION_DELAY,
    reconnectionDelayMax: ENVIRONMENT_CONFIG.SOCKET_IO.RECONNECTION_DELAY_MAX,
    reconnectionAttempts: ENVIRONMENT_CONFIG.SOCKET_IO.RECONNECTION_ATTEMPTS,
  });

  // Instancia del servicio de mensajes (inyección de dependencia)
  const messageService = new MessageService();

  // =========================================================================
  // EVENT LISTENERS - MANEJADORES DE EVENTOS
  // =========================================================================

  io.on('connection', (socket) => {
    const clientId = socket.id;
    const username = CookieParserUtility.getUsernameFromCookie(
      socket.request.headers.cookie || ''
    );

    logger.info('Cliente conectado', { clientId, username });

    // Enviar historial de mensajes al cliente que se conecta
    try {
      const allMessages = messageService.getAllMessages();
      socket.emit(CONSTANTS.SOCKET_EVENTS.LOAD_MESSAGES, allMessages);
    } catch (error) {
      logger.error('Error al cargar mensajes', { error: error.message });
      socket.emit('error', {
        message: 'Error al cargar el historial de mensajes',
      });
    }

    // =====================================================================
    // EVENTO: Recibir mensaje de texto
    // =====================================================================
    socket.on(CONSTANTS.SOCKET_EVENTS.MESSAGE, (messageContent) => {
      try {
        // Validar mensaje
        MessageValidator.validateTextMessage(messageContent);
        MessageValidator.validateUsername(username);

        // Crear mensaje a través del servicio
        const newMessage = messageService.createMessage({
          content: messageContent,
          username,
          type: CONSTANTS.MESSAGE_TYPES.TEXT,
        });

        // Transmitir a todos los clientes conectados
        io.emit(CONSTANTS.SOCKET_EVENTS.MESSAGE_RECEIVED, newMessage);
      } catch (error) {
        logger.error('Error al procesar mensaje', {
          error: error.message,
          clientId,
          username,
        });
        socket.emit('error', { message: error.message });
      }
    });

    // =====================================================================
    // EVENTO: Recibir foto/imagen
    // =====================================================================
    socket.on(CONSTANTS.SOCKET_EVENTS.PHOTO, (photoData) => {
      try {
        // Validar datos de foto
        MessageValidator.validatePhotoData(photoData);
        MessageValidator.validateUsername(username);

        // Crear mensaje de foto a través del servicio
        const newPhotoMessage = messageService.createMessage({
          content: photoData,
          username,
          type: CONSTANTS.MESSAGE_TYPES.PHOTO,
        });

        // Transmitir a todos los clientes conectados
        io.emit(CONSTANTS.SOCKET_EVENTS.MESSAGE_RECEIVED, newPhotoMessage);
      } catch (error) {
        logger.error('Error al procesar foto', {
          error: error.message,
          clientId,
          username,
        });
        socket.emit('error', { message: error.message });
      }
    });

    // =====================================================================
    // EVENTO: Editar mensaje existente
    // =====================================================================
    socket.on(CONSTANTS.SOCKET_EVENTS.EDIT_MESSAGE, (editData) => {
      try {
        const { messageId, newContent } = editData;

        // Validar datos
        MessageValidator.validateMessageId(messageId);
        MessageValidator.validateTextMessage(newContent);

        // Editar mensaje a través del servicio
        const editedMessage = messageService.editMessage(messageId, newContent);

        // Notificar a todos sobre la edición
        io.emit(CONSTANTS.SOCKET_EVENTS.MESSAGE_EDITED, editedMessage);

        logger.info('Mensaje editado', { messageId, username });
      } catch (error) {
        logger.error('Error al editar mensaje', {
          error: error.message,
          clientId,
          username,
        });
        socket.emit('error', { message: error.message });
      }
    });

    // =====================================================================
    // EVENTO: Eliminar mensaje
    // =====================================================================
    socket.on(CONSTANTS.SOCKET_EVENTS.DELETE_MESSAGE, (messageId) => {
      try {
        // Validar ID
        MessageValidator.validateMessageId(messageId);

        // Eliminar mensaje a través del servicio
        messageService.deleteMessage(messageId);

        // Notificar a todos sobre la eliminación
        io.emit(CONSTANTS.SOCKET_EVENTS.MESSAGE_DELETED, messageId);

        logger.info('Mensaje eliminado', { messageId, username });
      } catch (error) {
        logger.error('Error al eliminar mensaje', {
          error: error.message,
          clientId,
          username,
        });
        socket.emit('error', { message: error.message });
      }
    });

    // =====================================================================
    // EVENTO: Usuario comenzó a escribir
    // =====================================================================
    socket.on(CONSTANTS.SOCKET_EVENTS.TYPING, () => {
      try {
        MessageValidator.validateUsername(username);

        // Notificar a otros usuarios (broadcast, excepto al emisor)
        socket.broadcast.emit(CONSTANTS.SOCKET_EVENTS.USER_TYPING, {
          username,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.error('Error en evento de typing', {
          error: error.message,
          clientId,
        });
      }
    });

    // =====================================================================
    // EVENTO: Usuario dejó de escribir
    // =====================================================================
    socket.on(CONSTANTS.SOCKET_EVENTS.STOP_TYPING, () => {
      socket.broadcast.emit(CONSTANTS.SOCKET_EVENTS.USER_STOP_TYPING, {
        username,
        timestamp: new Date().toISOString(),
      });
    });

    // =====================================================================
    // EVENTO: Desconexión del cliente
    // =====================================================================
    socket.on('disconnect', () => {
      logger.info('Cliente desconectado', {
        clientId,
        username,
        connectedClients: io.engine.clientsCount,
      });
    });

    // =====================================================================
    // MANEJO DE ERRORES DE SOCKET
    // =====================================================================
    socket.on('error', (error) => {
      logger.error('Error en socket', {
        error: error.message,
        clientId,
        username,
      });
    });
  });

  logger.info('Socket.IO inicializado correctamente');

  return io;
};


//nodemon nos permite actualizar las nuevas actualizaciones sin tener que reiniciar el servidor, es decir, cada vez que guardamos un cambio en el codigo, nodemon reinicia el servidor automaticamente para que los cambios se reflejen en la aplicacion, esto es muy util para el desarrollo, ya que no tenemos que estar reiniciando el servidor manualmente cada vez que hacemos un cambio.
//real-time-server.js logica de coskets, el un server es express, el otro server es socket io
//los dos servidores trabajan de la mano 

//los servidores tenermos la conexion y escucha de eventos
//full duplex es programacion orientada a eventos, es decir, cada vez que se conecta un cliente, se ejecuta una funcion, cada vez que se desconecta un cliente, se ejecuta otra funcion, cada vez que se envia un mensaje, se ejecuta otra funcion, etc. Esto es lo que hace que la aplicacion sea en tiempo real, ya que cada vez que ocurre un evento, se ejecuta una funcion y se actualiza la aplicacion en tiempo real.
//el servidor debe empezar a escuchar los eventos, de todos los usuarios escucha como llegan los eventos 
