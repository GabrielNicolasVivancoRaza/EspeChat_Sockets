/**
 * @file messageService.js
 * @description Servicio de lógica de negocio para mensajes
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: Single Responsibility Principle (SRP) y Separation of Concerns
 * Encapsula la lógica de negocio de mensajes, separándola de los eventos de Socket.IO
 */

const MessageValidator = require('../validators/messageValidator');
const logger = require('../utils/logger');
const CONSTANTS = require('../config/constants');

class MessageService {
  constructor() {
    // Almacenamiento de mensajes (en un caso real, sería una BD)
    this.messages = [];
    this.messageIdCounter = 0;
  }

  /**
   * Crea un nuevo mensaje
   * @param {Object} messageData - Datos del mensaje
   * @param {string} messageData.content - Contenido del mensaje
   * @param {string} messageData.username - Usuario que envía el mensaje
   * @param {string} messageData.type - Tipo de mensaje (text, photo, system)
   * @returns {Object} Mensaje creado con ID único
   * @throws {ValidationError} Si los datos no son válidos
   */
  createMessage(messageData) {
    const { content, username, type = CONSTANTS.MESSAGE_TYPES.TEXT } = messageData;

    // Validar datos según el tipo
    if (type === CONSTANTS.MESSAGE_TYPES.TEXT) {
      MessageValidator.validateTextMessage(content);
    } else if (type === CONSTANTS.MESSAGE_TYPES.PHOTO) {
      MessageValidator.validatePhotoData(content);
    }

    MessageValidator.validateUsername(username);

    const newMessage = {
      id: this.messageIdCounter++,
      username,
      content,
      type,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString(),
      edited: false,
      deletedAt: null,
    };

    this.messages.push(newMessage);
    logger.info('Mensaje creado', { messageId: newMessage.id, username });

    return newMessage;
  }

  /**
   * Obtiene todos los mensajes
   * @returns {Array} Array de mensajes
   */
  getAllMessages() {
    return this.messages.filter(msg => !msg.deletedAt);
  }

  /**
   * Obtiene un mensaje por ID
   * @param {number} messageId - ID del mensaje
   * @returns {Object|null} Mensaje encontrado o null
   */
  getMessageById(messageId) {
    MessageValidator.validateMessageId(messageId);
    return this.messages.find(msg => msg.id === messageId && !msg.deletedAt) || null;
  }

  /**
   * Edita un mensaje existente
   * @param {number} messageId - ID del mensaje
   * @param {string} newContent - Nuevo contenido
   * @returns {Object} Mensaje editado
   * @throws {ValidationError|NotFoundError} Si hay errores
   */
  editMessage(messageId, newContent) {
    MessageValidator.validateMessageId(messageId);
    MessageValidator.validateTextMessage(newContent);

    const messageIndex = this.messages.findIndex(msg => msg.id === messageId);

    if (messageIndex === -1) {
      logger.warn('Intento de editar mensaje inexistente', { messageId });
      throw new Error(`Mensaje con ID ${messageId} no encontrado`);
    }

    this.messages[messageIndex].content = newContent.trim();
    this.messages[messageIndex].edited = true;
    this.messages[messageIndex].lastEditedAt = new Date().toISOString();

    logger.info('Mensaje editado', { messageId });

    return this.messages[messageIndex];
  }

  /**
   * Elimina un mensaje (soft delete)
   * @param {number} messageId - ID del mensaje a eliminar
   * @returns {boolean} true si se eliminó correctamente
   * @throws {ValidationError|NotFoundError} Si hay errores
   */
  deleteMessage(messageId) {
    MessageValidator.validateMessageId(messageId);

    const messageIndex = this.messages.findIndex(msg => msg.id === messageId);

    if (messageIndex === -1) {
      logger.warn('Intento de eliminar mensaje inexistente', { messageId });
      throw new Error(`Mensaje con ID ${messageId} no encontrado`);
    }

    // Soft delete: marcamos como eliminado en lugar de borrarlo
    this.messages[messageIndex].deletedAt = new Date().toISOString();
    logger.info('Mensaje eliminado', { messageId });

    return true;
  }

  /**
   * Obtiene estadísticas de mensajes
   * @returns {Object} Estadísticas
   */
  getMessageStats() {
    const activeMessages = this.messages.filter(msg => !msg.deletedAt);
    const textMessages = activeMessages.filter(msg => msg.type === CONSTANTS.MESSAGE_TYPES.TEXT);
    const photoMessages = activeMessages.filter(msg => msg.type === CONSTANTS.MESSAGE_TYPES.PHOTO);

    return {
      totalMessages: activeMessages.length,
      textMessages: textMessages.length,
      photoMessages: photoMessages.length,
      deletedMessages: this.messages.filter(msg => msg.deletedAt).length,
    };
  }

  /**
   * Limpia la memoria eliminando permanentemente mensajes antiguos (mantiene historial)
   * @param {number} daysToKeep - Número de días a mantener
   */
  cleanupOldMessages(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const initialCount = this.messages.length;
    
    this.messages = this.messages.filter(msg => 
      new Date(msg.timestamp) > cutoffDate
    );

    const removedCount = initialCount - this.messages.length;
    logger.info('Limpieza de mensajes antiguos', { 
      removedCount, 
      daysToKeep,
      remainingMessages: this.messages.length 
    });
  }
}

module.exports = MessageService;
