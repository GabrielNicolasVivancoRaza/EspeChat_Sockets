/**
 * @file index.js
 * @description Punto de entrada de la aplicación
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * ARQUITECTURA: Arquitectura en capas con separación de responsabilidades
 * - Capa de Presentación: Express & Socket.IO
 * - Capa de Lógica de Negocio: Services
 * - Capa de Acceso a Datos: (Para extensión futura)
 * 
 * PRINCIPIOS APLICADOS:
 * - DRY: Uso de constantes y configuración centralizada
 * - SOLID: Separación de responsabilidades
 * - Clean Code: Nombres descriptivos y comentarios útiles
 */

const express = require('express');
const { createServer } = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

const realTimeServer = require('./realTimeServer');
const logger = require('./utils/logger');
const ENVIRONMENT_CONFIG = require('./config/environment');

// ============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================================================

const app = express();
const httpServer = createServer(app);

// ============================================================================
// CONFIGURACIÓN DE EXPRESS
// ============================================================================

// Configurar puerto desde variables de ambiente
app.set('port', ENVIRONMENT_CONFIG.PORT);

// Configurar directorio de vistas
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Parsear cookies
app.use(cookieParser());

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// RUTAS
// ============================================================================

app.use(require('./routes'));

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const startServer = () => {
  const port = app.get('port');
  
  httpServer.listen(port, () => {
    logger.info(`Servidor iniciado correctamente`, { 
      port,
      environment: ENVIRONMENT_CONFIG.NODE_ENV 
    });
  });

  // Inicializar Socket.IO para comunicación en tiempo real
  realTimeServer(httpServer);

  // Manejo de errores no capturados
  process.on('uncaughtException', (error) => {
    logger.error('Error no capturado', { 
      message: error.message,
      stack: error.stack 
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Promesa rechazada no manejada', { reason });
    process.exit(1);
  });
};

// Iniciar el servidor
if (require.main === module) {
  startServer();
}

module.exports = { app, httpServer, startServer };
