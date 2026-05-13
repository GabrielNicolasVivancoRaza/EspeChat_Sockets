# Guía de Práctica: Extensión de Chat en Tiempo Real con Node.js y Socket.IO

## 1. Información General
- **Asignatura:** Aplicaciones Distribuidas
- **Tema:** Comunicación bidireccional en tiempo real con WebSockets (Socket.IO)
- **Conocimientos Previos:** Fundamentos de Node.js, Express, JavaScript asíncrono y manipulación del DOM

## 2. Contexto y Justificación
En el desarrollo de aplicaciones web modernas, la comunicación en tiempo real es esencial para brindar experiencias interactivas y dinámicas. En esta unidad, hemos analizado un proyecto base de un Chat en Tiempo Real, desarrollado con Express y Socket.IO. Dicho proyecto permite la conexión de múltiples clientes y el intercambio de mensajes de texto en una sala general.

Para consolidar el aprendizaje, no basta con leer y ejecutar el código existente. Según enfoques constructivistas del aprendizaje (como el Aprendizaje Basado en Proyectos), el estudiante debe interactuar con el código, comprender su flujo y aplicar los conceptos adquiridos resolviendo un problema nuevo dentro de una arquitectura ya establecida.

## 3. Objetivos de Aprendizaje
- Comprender la arquitectura cliente-servidor orientada a eventos mediante el uso de WebSockets
- Analizar un código fuente existente para identificar los puntos de entrada y salida de datos
- Desarrollar una nueva funcionalidad ("Feature") extendiendo la lógica de eventos tanto en el Frontend (cliente) como en el Backend (servidor)
- Aplicar buenas prácticas de programación, manteniendo la coherencia con la estructura original del proyecto

## 4. Instrucciones de la Tarea (Metodología de Trabajo)
La tarea consiste en extender el proyecto del "Chat en Tiempo Real" agregando una nueva característica muy común en aplicaciones de mensajería: **El indicador de "Usuario escribiendo..."**.

El flujo de trabajo se divide en 4 fases metodológicas:

### Fase 1: Análisis y Exploración
1. Clona el repositorio del proyecto base y ejecuta `npm install`
2. Revisa detenidamente los archivos clave:
   - **src/realTimeServer.js:** Analiza cómo se configura el servidor de Socket.IO, cómo se obtiene el usuario desde las cookies y cómo se emite el evento message
   - **El código del cliente (en la carpeta src/public o src/views):** Comprende cómo el navegador se conecta al socket y cómo inyecta los mensajes en el DOM

### Fase 2: Diseño de la Solución
1. Define qué nuevos eventos necesitas. Sugerencia: `typing` (escribiendo) y `stopTyping` (dejó de escribir)
2. Determina la carga de datos (payload) de estos eventos (ej. enviar el nombre del usuario que está escribiendo)
3. Planifica cómo el servidor debe retransmitir estos eventos (¿debería enviarse al usuario que lo emite o solo a los demás? Piensa en el uso de `socket.broadcast`)

### Fase 3: Implementación (Codificación)
1. **Frontend:** Agrega "Event Listeners" (keydown, keyup o input) en la caja de texto del chat. Cuando el usuario teclee, emite el evento al servidor
2. **Backend:** En realTimeServer.js, escucha los nuevos eventos y retransmítelos al resto de usuarios conectados
3. **Frontend:** Escucha los eventos provenientes del servidor y manipula el DOM para mostrar/ocultar dinámicamente un texto tipo: "Juan está escribiendo..." en la parte inferior del chat

### Fase 4: Verificación y Pruebas
1. Levanta el servidor (`npm run dev` o `npm start`)
2. Abre dos o más pestañas en tu navegador (o usa el modo incógnito para tener usuarios distintos)
3. Verifica que al escribir en la ventana del Usuario A, el Usuario B ve la notificación de forma fluida, y que esta desaparece al dejar de teclear
