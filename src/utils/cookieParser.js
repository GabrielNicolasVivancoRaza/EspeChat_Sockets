/**
 * @file cookieParser.js
 * @description Utilidad para parsear y extraer cookies
 * @author Gabriel Nicolás Vivanco Raza
 * 
 * PRINCIPIO APLICADO: Single Responsibility Principle (SRP)
 * Encapsula toda la lógica de parseo de cookies en un lugar
 */

const CONSTANTS = require('../config/constants');

class CookieParserUtility {
  /**
   * Extrae el valor de una cookie específica
   * @param {string} cookieString - String de cookies (ej: "user=john; theme=dark")
   * @param {string} cookieName - Nombre de la cookie a extraer
   * @returns {string|null} Valor de la cookie o null si no existe
   */
  static extractCookieValue(cookieString, cookieName) {
    if (!cookieString || typeof cookieString !== 'string') {
      return null;
    }

    const cookies = cookieString.split(CONSTANTS.COOKIES.COOKIE_SEPARATOR);
    
    for (const cookie of cookies) {
      const [keyName, value] = cookie
        .trim()
        .split(CONSTANTS.COOKIES.COOKIE_PAIR_SEPARATOR);
      
      if (keyName === cookieName && value) {
        return decodeURIComponent(value);
      }
    }

    return null;
  }

  /**
   * Obtiene el nombre de usuario desde las cookies
   * @param {string} cookieString - String de cookies
   * @returns {string} Nombre de usuario o 'Anónimo' si no está autenticado
   */
  static getUsernameFromCookie(cookieString) {
    const username = this.extractCookieValue(
      cookieString,
      CONSTANTS.COOKIES.USER_KEY
    );
    return username || CONSTANTS.SOCKET_IO.ANONYMOUS_USER;
  }

  /**
   * Parsea todas las cookies en un objeto
   * @param {string} cookieString - String de cookies
   * @returns {Object} Objeto con todas las cookies
   */
  static parseAllCookies(cookieString) {
    const cookiesObject = {};

    if (!cookieString || typeof cookieString !== 'string') {
      return cookiesObject;
    }

    const cookies = cookieString.split(CONSTANTS.COOKIES.COOKIE_SEPARATOR);
    
    for (const cookie of cookies) {
      const [keyName, value] = cookie
        .trim()
        .split(CONSTANTS.COOKIES.COOKIE_PAIR_SEPARATOR);
      
      if (keyName && value) {
        cookiesObject[keyName] = decodeURIComponent(value);
      }
    }

    return cookiesObject;
  }
}

module.exports = CookieParserUtility;
