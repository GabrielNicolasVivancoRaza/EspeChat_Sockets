/**
 * @file messageValidator.js
 * @description Validador para mensajes del sistema de chat
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: Single Responsibility Principle (SRP)
 * Encapsula toda la lógica de validación de mensajes
 */

const { ValidationError } = require('../exceptions/ApplicationError');
const CONSTANTS = require('../config/constants');

class MessageValidator {
  /**
   * Valida un mensaje de texto
   * @param {string} messageContent - Contenido del mensaje
   * @throws {ValidationError} Si el mensaje no es válido
   * @returns {boolean} true si es válido
   */
  static validateTextMessage(messageContent) {
    if (!messageContent) {
      throw new ValidationError(
        'El mensaje no puede estar vacío',
        'EMPTY_MESSAGE'
      );
    }

    if (typeof messageContent !== 'string') {
      throw new ValidationError(
        'El mensaje debe ser una cadena de texto',
        'INVALID_MESSAGE_TYPE'
      );
    }

    const trimmedMessage = messageContent.trim();

    if (trimmedMessage.length < CONSTANTS.VALIDATION.MIN_MESSAGE_LENGTH) {
      throw new ValidationError(
        `El mensaje debe tener al menos ${CONSTANTS.VALIDATION.MIN_MESSAGE_LENGTH} carácter`,
        'MESSAGE_TOO_SHORT'
      );
    }

    if (trimmedMessage.length > CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH) {
      throw new ValidationError(
        `El mensaje no puede exceder ${CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH} caracteres`,
        'MESSAGE_TOO_LONG'
      );
    }

    return true;
  }

  /**
   * Valida un ID de mensaje
   * @param {number} messageId - ID del mensaje
   * @throws {ValidationError} Si el ID no es válido
   * @returns {boolean} true si es válido
   */
  static validateMessageId(messageId) {
    if (!Number.isInteger(messageId) || messageId < 0) {
      throw new ValidationError(
        'El ID del mensaje debe ser un número entero positivo',
        'INVALID_MESSAGE_ID'
      );
    }

    return true;
  }

  /**
   * Valida el formato de datos de una foto en base64
   * @param {string} photoData - Datos de la foto en base64
   * @throws {ValidationError} Si los datos no son válidos
   * @returns {boolean} true si es válido
   */
  static validatePhotoData(photoData) {
    if (!photoData) {
      throw new ValidationError(
        'Los datos de la foto no pueden estar vacíos',
        'EMPTY_PHOTO_DATA'
      );
    }

    if (typeof photoData !== 'string') {
      throw new ValidationError(
        'Los datos de la foto deben ser una cadena de texto',
        'INVALID_PHOTO_DATA_TYPE'
      );
    }

    // Validación básica de base64
    if (!this.isValidBase64(photoData)) {
      throw new ValidationError(
        'Los datos de la foto no tienen un formato base64 válido',
        'INVALID_BASE64_FORMAT'
      );
    }

    return true;
  }

  /**
   * Valida si una cadena es base64
   * @param {string} str - Cadena a validar
   * @returns {boolean} true si es base64 válido
   */
  static isValidBase64(str) {
    try {
      return /^[A-Za-z0-9+/=]*$/.test(str) && 
             (str.length % 4 === 0);
    } catch (error) {
      return false;
    }
  }

  /**
   * Valida un nombre de usuario
   * @param {string} username - Nombre de usuario
   * @throws {ValidationError} Si el usuario no es válido
   * @returns {boolean} true si es válido
   */
  static validateUsername(username) {
    if (!username) {
      throw new ValidationError(
        'El nombre de usuario no puede estar vacío',
        'EMPTY_USERNAME'
      );
    }

    if (typeof username !== 'string') {
      throw new ValidationError(
        'El nombre de usuario debe ser una cadena de texto',
        'INVALID_USERNAME_TYPE'
      );
    }

    if (username.length < CONSTANTS.VALIDATION.MIN_USERNAME_LENGTH) {
      throw new ValidationError(
        `El nombre de usuario debe tener al menos ${CONSTANTS.VALIDATION.MIN_USERNAME_LENGTH} caracteres`,
        'USERNAME_TOO_SHORT'
      );
    }

    if (username.length > CONSTANTS.VALIDATION.MAX_USERNAME_LENGTH) {
      throw new ValidationError(
        `El nombre de usuario no puede exceder ${CONSTANTS.VALIDATION.MAX_USERNAME_LENGTH} caracteres`,
        'USERNAME_TOO_LONG'
      );
    }

    return true;
  }
}

module.exports = MessageValidator;
