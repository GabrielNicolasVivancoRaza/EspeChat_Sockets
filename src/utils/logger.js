/**
 * @file logger.js
 * @description Sistema de logging centralizado de la aplicación
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: Single Responsibility Principle (SRP)
 * Toda la lógica de logging está centralizada en un único lugar
 * para facilitar cambios y mantenimiento
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const LOG_LEVEL_PRIORITY = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class Logger {
  constructor(logLevel = 'info') {
    this.logLevel = logLevel.toUpperCase();
    this.currentPriority = LOG_LEVEL_PRIORITY[this.logLevel] || 2;
  }

  /**
   * Formatea un mensaje de log con timestamp y nivel
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje a loguear
   * @param {Object} metadata - Información adicional
   * @returns {string} Mensaje formateado
   */
  formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const metadataString = Object.keys(metadata).length > 0 
      ? ` | ${JSON.stringify(metadata)}`
      : '';
    
    return `[${timestamp}] [${level}] ${message}${metadataString}`;
  }

  /**
   * Log de error
   * @param {string} message - Mensaje de error
   * @param {Object} metadata - Información adicional
   */
  error(message, metadata = {}) {
    if (LOG_LEVEL_PRIORITY[LOG_LEVELS.ERROR] <= this.currentPriority) {
      console.error(this.formatMessage(LOG_LEVELS.ERROR, message, metadata));
    }
  }

  /**
   * Log de advertencia
   * @param {string} message - Mensaje de advertencia
   * @param {Object} metadata - Información adicional
   */
  warn(message, metadata = {}) {
    if (LOG_LEVEL_PRIORITY[LOG_LEVELS.WARN] <= this.currentPriority) {
      console.warn(this.formatMessage(LOG_LEVELS.WARN, message, metadata));
    }
  }

  /**
   * Log de información
   * @param {string} message - Mensaje informativo
   * @param {Object} metadata - Información adicional
   */
  info(message, metadata = {}) {
    if (LOG_LEVEL_PRIORITY[LOG_LEVELS.INFO] <= this.currentPriority) {
      console.log(this.formatMessage(LOG_LEVELS.INFO, message, metadata));
    }
  }

  /**
   * Log de debug
   * @param {string} message - Mensaje de debug
   * @param {Object} metadata - Información adicional
   */
  debug(message, metadata = {}) {
    if (LOG_LEVEL_PRIORITY[LOG_LEVELS.DEBUG] <= this.currentPriority) {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message, metadata));
    }
  }
}

// Crear instancia singleton
const logger = new Logger(process.env.LOG_LEVEL || 'info');

module.exports = logger;
