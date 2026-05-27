/**
 * @file environment.js
 * @description Gestiona la configuración del ambiente (desarrollo, prueba, producción)
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: Single Responsibility Principle (SRP)
 * Separa la configuración ambiental del resto de la lógica
 */

const ENVIRONMENT_CONFIG = {
  // AMBIENTE ACTUAL
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // PUERTOS
  PORT: process.env.PORT || 3000,
  
  // LOGGING
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // AMBIENTE DE DESARROLLO
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // SOCKET IO CONFIG
  SOCKET_IO: {
    CORS: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
    RECONNECTION: true,
    RECONNECTION_DELAY: 1000,
    RECONNECTION_DELAY_MAX: 5000,
    RECONNECTION_ATTEMPTS: 5,
  },
};

module.exports = ENVIRONMENT_CONFIG;
