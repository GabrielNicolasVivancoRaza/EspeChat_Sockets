/**
 * @file ApplicationError.js
 * @description Clase base para errores de la aplicación
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: Clean Code - Manejo de Excepciones Consistente
 * Todos los errores de la aplicación heredan de esta clase base
 * para mantener consistencia y facilitar el manejo de errores
 */

class ApplicationError extends Error {
  /**
   * Constructor de ApplicationError
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP de estado
   * @param {string} errorCode - Código único del error
   */
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    
    // Capturar la pila de llamadas
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convierte el error a un objeto para respuestas HTTP
   * @returns {Object} Objeto serializable con información del error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }
}

/**
 * Error de validación
 */
class ValidationError extends ApplicationError {
  constructor(message, errorCode = 'VALIDATION_ERROR') {
    super(message, 400, errorCode);
  }
}

/**
 * Error de no encontrado
 */
class NotFoundError extends ApplicationError {
  constructor(resource, errorCode = 'NOT_FOUND') {
    super(`${resource} no encontrado`, 404, errorCode);
  }
}

/**
 * Error de autenticación
 */
class AuthenticationError extends ApplicationError {
  constructor(message = 'Usuario no autenticado', errorCode = 'AUTHENTICATION_ERROR') {
    super(message, 401, errorCode);
  }
}

/**
 * Error de autorización
 */
class AuthorizationError extends ApplicationError {
  constructor(message = 'No autorizado', errorCode = 'AUTHORIZATION_ERROR') {
    super(message, 403, errorCode);
  }
}

/**
 * Error en operación de base de datos
 */
class DatabaseError extends ApplicationError {
  constructor(message, errorCode = 'DATABASE_ERROR') {
    super(message, 500, errorCode);
  }
}

module.exports = {
  ApplicationError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
};
