# Presentación: Event Loop y Bloqueo en Node.js

## Duración Total: 5-7 minutos

---

## 1. CONTEXTO (1 min)

### Objetivo de la Tarea
Demostrar empíricamente cómo un **cómputo intensivo en CPU bloquea el Event Loop** de Node.js, degradando el rendimiento de toda la aplicación, en contraste con operaciones de **I/O que no lo hacen**.

### Pregunta Central
**¿Por qué Node.js es excelente para I/O pero débil para cálculos pesados?**

### Conceptos Clave a Mencionar
- **Event Loop**: El corazón de Node.js, un bucle que procesa eventos y callbacks
- **Single-threaded**: Node.js usa UN SOLO hilo principal
- **Non-blocking I/O**: Las operaciones de lectura/escritura NO detienen el programa
- **CPU-bound vs I/O-bound**: 
  - I/O-bound: lectura de archivos, consultas a BD (dejalas al SO)
  - CPU-bound: cálculos matemáticos (ejecuta el proceso)

---

## 2. DEMOSTRACIÓN DEL CÓDIGO (1 min)

### Mostrar `/io-test` (Asíncrono - No bloqueante)

**Archivo:** `src/routes/index.js` (líneas 27-48)

```javascript
router.get('/io-test', (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'package.json');
    
    // fs.readFile es ASÍNCRONO
    // El Event Loop delega al SO y sigue libre
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al leer el archivo.');
        }
        res.type('json').send(data);
    });
});
```

**Explica:**
> "Este endpoint lee un archivo usando `fs.readFile`, que es **asíncrono**. Node.js delega la lectura al sistema operativo y el Event Loop sigue libre para procesar más peticiones mientras el archivo se lee. Es como enviar una carta por correo: no esperas a que llegue, solo continúas con tu vida."

---

### Mostrar `/cpu-block` (Síncrono - Bloqueante)

**Archivo:** `src/routes/index.js` (líneas 50-75)

```javascript
router.get('/cpu-block', (req, res) => {
    // Este cálculo es SÍNCRONO y pesado
    // El Event Loop está BLOQUEADO mientras se ejecuta
    const resultado = calcularFibonacci(40);
    res.send(`El resultado del cálculo intensivo es: ${resultado}`);
});

function calcularFibonacci(num) {
    if (num <= 1) return 1;
    return calcularFibonacci(num - 1) + calcularFibonacci(num - 2);
}
```

**Explica:**
> "Este endpoint calcula Fibonacci(40) de forma **síncrona**. Node.js está ocupado haciendo matemáticas y NO PUEDE hacer nada más hasta que termine. El Event Loop está 100% bloqueado. Es como si estuvieras esperando en una fila y el cajero solo atiende al cliente actual, ignorando a todos los demás."

---

## 3. EJECUCIÓN EN VIVO (3 min)

### Pre-requisitos
1. ✅ El servidor debe estar corriendo: `npm start`
2. ✅ Tener 3 terminales abiertas (una para el servidor, dos para pruebas)

---

### Prueba 1: BOMBARDEO A `/io-test` (No bloqueante)

**Duración esperada:** ~15 segundos

```bash
npx autocannon -c 10 -d 10 http://localhost:3000/io-test
```

**Resultados esperados:**
- ✅ Latency Avg: **5-50 ms** (muy rápido)
- ✅ Req/Sec Avg: **500-2000 req/s** (muchas peticiones procesadas)
- ✅ La barra de progreso avanza sin problemas

**Lo que hay que decir:**
> "Como ven, el endpoint `/io-test` maneja fácilmente 10 conexiones concurrentes. La latencia es baja (alrededor de X ms) y procesa cientos o miles de peticiones por segundo. El Event Loop está feliz delegando la I/O al SO."

---

### Prueba 2: BOMBARDEO A `/cpu-block` (Bloqueante)

**Duración esperada:** ~30-40 segundos (tardará mucho más)

```bash
npx autocannon -c 10 -d 10 http://localhost:3000/cpu-block
```

**Resultados esperados:**
- ❌ Latency Avg: **5000-15000 ms** (MUCHO más lento)
- ❌ Req/Sec Avg: **1-5 req/s** (muy pocas peticiones)
- ❌ La barra de progreso avanza lentamente, se "cuelga"

**Lo que hay que decir:**
> "¡Fíjense! La latencia ahora es de MILES de milisegundos. Solo procesa 1-5 peticiones por segundo. ¿Por qué? Porque el cálculo de Fibonacci bloquea completamente el Event Loop. Cada petición debe esperar a que termine la anterior."

---

### Prueba 3: DEMOSTRAR EL BLOQUEO EN VIVO (El Momento Épico)

**Mientras se ejecuta la prueba de `/cpu-block`:**

1. **Espera a que autocannon haya estado corriendo ~5 segundos**
2. **Abre una nueva terminal (la 3ª)**
3. **Intenta acceder a la página principal:**

```bash
curl http://localhost:3000/
```

O simplemente abre en el navegador: `http://localhost:3000/`

**Lo que ocurre:**
- ❌ La página **NO RESPONDE**
- ❌ El navegador/curl se queda esperando indefinidamente
- ❌ Nada funciona: ni el chat, ni I/O, NI NADA

**Lo que hay que decir:**
> "¡Miren! Intenté cargar la página principal del chat, pero el servidor NO responde. Está completamente congelado. El Event Loop está tan ocupado calculando Fibonacci que no puede ni procesar una simple solicitud GET. Esto es el bloqueo en toda su gloria."

---

## 4. ANÁLISIS Y CONCLUSIONES (2 min)

### Pregunta 1: ¿Por qué `/io-test` fue tan rápido?

**Respuesta:**
> "El endpoint `/io-test` usa `fs.readFile`, que es una operación **asíncrona**. Esto significa:
>
> 1. Node.js le dice al sistema operativo: 'Lee este archivo por mí'
> 2. El Event Loop se libera y continúa procesando otras peticiones
> 3. Cuando el SO termina la lectura, ejecuta el callback
> 4. Resultado: El Event Loop nunca se bloquea
>
> Es como tener un asistente: le das una tarea, él la hace, y tú mientras tanto atiendes a más clientes."

---

### Pregunta 2: ¿Por qué `/cpu-block` fue tan lento?

**Respuesta:**
> "El endpoint `/cpu-block` usa una función **síncrona** (calcularFibonacci). Esto significa:
>
> 1. Node.js comienza a calcular Fibonacci(40)
> 2. El hilo principal está 100% ocupado: es matemática pura, sin I/O
> 3. El Event Loop NO PUEDE hacer nada mientras se calcula
> 4. Todas las otras peticiones esperan en la cola
> 5. Resultado: Bloqueo total, latencia extrema
>
> Es como si solo tuvieras UN cajero, y si está haciendo un cálculo complicado en la calculadora, todos los demás clientes deben esperar. Aunque solo sea 1 cliente bloqueado, afecta a todos."

---

### Pregunta 3: ¿Por qué el chat se congeló?

**Respuesta:**
> "El Event Loop de Node.js es **single-threaded**. Eso significa:
>
> - Hay UN SOLO hilo manejando TODAS las peticiones
> - Socket.IO, Express, todo comparte ese hilo
> - Si una petición bloquea el Event Loop, TODO bloquea: chat, conexiones, rutas
>
> Cuando autocannon bombardeaba `/cpu-block`, ese único hilo estaba haciendo cálculos de Fibonacci. Cuando intenté cargar la página del chat, esa petición se puso en la cola y espera. Y espera. Y espera... indefinidamente mientras termina el cálculo."

---

## 5. RECOMENDACIÓN FINAL (30 segundos)

### ¿Qué NUNCA debes hacer en Node.js?

❌ **EVITAR en el hilo principal:**
- Cálculos matemáticos pesados (Fibonacci, algoritmos complejos)
- Procesamiento de imágenes (resize, conversión)
- Compresión de datos
- Cualquier operación que acapare la CPU

### ✅ **Alternativas teóricas:**

1. **Worker Threads**: Hilo separado para CPU-bound
   ```javascript
   const { Worker } = require('worker_threads');
   // Mover calcularFibonacci a un worker
   ```

2. **Procesos separados**: Microservicios
   ```bash
   # Servicio de cálculos en otro proceso/máquina
   ```

3. **Colas de tareas**: Bull, RabbitMQ
   ```javascript
   // Encolar cálculos y procesarlos asincronamente
   ```

4. **Lenguajes compilados**: C++, Rust
   ```javascript
   // Usar native modules para operaciones pesadas
   ```

### **CONCLUSIÓN:**

> "Node.js es **excelente para I/O**, porque delega al SO y el Event Loop siempre está libre. Pero es **desastroso para CPU-bound**, porque un solo cálculo bloquea todo. Entonces, **usa Node.js para APIs, chats, streaming**, pero **saca los cálculos pesados a otro lugar**."

---

## COMANDOS RESUMEN (Para copiar-pegar rápidamente)

```bash
# Terminal 1: Ejecutar el servidor
npm start

# Terminal 2: Prueba I/O
npx autocannon -c 10 -d 10 http://localhost:3000/io-test

# Terminal 2: Prueba CPU (después de la anterior)
npx autocannon -c 10 -d 10 http://localhost:3000/cpu-block

# Terminal 3: Mientras corre CPU-block, intenta acceder
curl http://localhost:3000/
# O en navegador: http://localhost:3000/
```

---

## TIPS PARA LA PRESENTACIÓN

✅ **DO:**
- Habla lentamente y con convicción
- Mantén el contacto visual
- Deja que los números hablen (latencia de 5ms vs 5000ms)
- Demuestra el bloqueo en vivo (es el momento más impactante)
- Usa análogías (banco, asistente, etc.)

❌ **DON'T:**
- No leas directamente el código, explícalo
- No hagas multitarea (abre una terminal a la vez)
- No des números aproximados sin ejecutar las pruebas
- No olvides que es sobre el Event Loop, no sobre autocannon

---

## PUNTUACIÓN ESPERADA

| Criterio | Nivel Destacado (5 pts) |
|----------|------------------------|
| **Implementación** | ✅ Rutas limpias con comentarios sobre asíncrono/síncrono |
| **Ejecución** | ✅ Pruebas con autocannon + demostración del bloqueo en vivo |
| **Análisis** | ✅ Explica claramente cómo el Event Loop se bloquea vs no se bloquea |
| **Conclusiones** | ✅ Recomendaciones sobre alternativas (Worker Threads, microservicios, etc.) |

