/**
 * @file isLoggedIn.js
 * @description Middleware para verificar si el usuario está autenticado
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: Single Responsibility Principle (SRP)
 * Middleware simple y reutilizable para proteger rutas
 */

const CookieParserUtility = require('../utils/cookieParser');
const { AuthenticationError } = require('../exceptions/ApplicationError');
const CONSTANTS = require('../config/constants');

/**
 * Middleware de autenticación
 * Verifica si el usuario tiene una cookie válida
 */
function isLoggedInMiddleware(req, res, next) {
  try {
    const cookieString = req.headers.cookie || '';
    const username = CookieParserUtility.getUsernameFromCookie(cookieString);

    // Si el usuario es anónimo, redirigir a registro
    if (username === CONSTANTS.SOCKET_IO.ANONYMOUS_USER) {
      return res.redirect(CONSTANTS.ROUTES.REGISTER);
    }

    // Adjuntar el usuario al objeto request para uso posterior
    req.user = { username };
    next();
  } catch (error) {
    next(new AuthenticationError('No se pudo verificar la autenticación'));
  }
}

module.exports = isLoggedInMiddleware;

