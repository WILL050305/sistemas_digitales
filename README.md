# 💧 Sistema de Monitoreo de Calidad del Agua (TDS)

![Estado del Proyecto](https://img.shields.io/badge/estado-activo-success.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue.svg)

Sistema de monitoreo en tiempo real de la calidad del agua mediante la medición de Sólidos Disueltos Totales (TDS) utilizando un sensor conectado a ESP32 y una interfaz web moderna.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Paso a Paso](#-instalación-paso-a-paso)
- [Configuración de Firebase](#-configuración-de-firebase)
- [Configuración del ESP32](#-configuración-del-esp32)
- [Ejecutar la Aplicación](#-ejecutar-la-aplicación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Escala de Clasificación TDS](#-escala-de-clasificación-tds)
- [Características Avanzadas](#-características-avanzadas)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🌟 Descripción

Este proyecto es un **sistema completo de monitoreo de calidad del agua** que mide los niveles de TDS (Total Dissolved Solids - Sólidos Disueltos Totales) en tiempo real. El sistema utiliza:

- **Hardware**: Sensor TDS conectado a un microcontrolador ESP32
- **Backend**: Firebase Realtime Database para almacenamiento en la nube
- **Frontend**: Aplicación web moderna desarrollada con React + Vite

El sistema proporciona visualización en tiempo real, alertas automáticas cuando los niveles de TDS son peligrosos, historial completo de mediciones y capacidad de exportación a Excel.

---

## ✨ Características

### Monitoreo en Tiempo Real
- 📊 **Visualización de TDS actual** con indicadores de color según nivel de calidad
- ⏰ **Actualización automática** desde Firebase
- 🔴 **Estado de conexión** visual (conectado/desconectado)

### Sistema de Alertas
- 🚨 **Alertas automáticas** cuando TDS supera 1000 ppm
- ⏱️ **Notificaciones temporales** (5 segundos de duración)
- 📱 **Máximo 4 alertas simultáneas** en pantalla
- 🎨 **Animaciones fluidas** de entrada y salida

### Historial Completo
- 📅 **Registro histórico** de todas las mediciones
- 🔄 **Paginación inteligente** (20 registros por página)
- 🎯 **Ordenamiento automático** (mediciones críticas al final)
- 📥 **Exportación a Excel** con un clic

### Clasificación de Calidad
- 🎨 **7 niveles de clasificación** con colores distintivos
- 📖 **Explicaciones detalladas** para cada nivel
- 🔍 **Información educativa** sobre estándares de agua potable

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Librería de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida para desarrollo
- **Tailwind CSS** - Framework de CSS para diseño moderno
- **Firebase SDK** - Conexión con base de datos en tiempo real
- **XLSX** - Librería para exportar datos a Excel

### Backend/Base de Datos
- **Firebase Realtime Database** - Base de datos NoSQL en tiempo real
- **Firebase Authentication** - Sistema de autenticación

### Hardware (no incluido en este repositorio)
- **ESP32** - Microcontrolador con WiFi
- **Sensor TDS** - Sensor analógico de conductividad

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

### 1. Node.js y npm
Node.js es un entorno de ejecución de JavaScript. npm es el gestor de paquetes que viene incluido.

**¿Cómo instalar?**
1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión **LTS** (Long Term Support) - recomendada
3. Ejecuta el instalador y sigue las instrucciones
4. Para verificar que se instaló correctamente, abre una terminal y ejecuta:
   ```bash
   node --version
   npm --version
   ```
   Deberías ver números de versión (ejemplo: v18.17.0 y 9.6.7)

### 2. Git
Git es un sistema de control de versiones para gestionar tu código.

**¿Cómo instalar?**
1. Ve a [git-scm.com](https://git-scm.com/)
2. Descarga el instalador para tu sistema operativo
3. Ejecuta el instalador con las opciones por defecto
4. Verifica la instalación:
   ```bash
   git --version
   ```

### 3. Cuenta de GitHub
GitHub es una plataforma para alojar proyectos.

**¿Cómo crear una cuenta?**
1. Ve a [github.com](https://github.com/)
2. Haz clic en "Sign up"
3. Sigue los pasos para crear tu cuenta gratuita

### 4. Cuenta de Firebase
Firebase es el servicio de Google para bases de datos en tiempo real.

**¿Cómo crear un proyecto?**
1. Ve a [console.firebase.google.com](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Agregar proyecto"
4. Sigue los pasos (puedes desactivar Google Analytics si no lo necesitas)

### 5. Editor de Código (Recomendado)
**Visual Studio Code** es un editor de código gratuito y potente.

1. Ve a [code.visualstudio.com](https://code.visualstudio.com/)
2. Descarga e instala
3. (Opcional) Instala extensiones útiles:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

---

## 🚀 Instalación Paso a Paso

### Paso 1: Clonar o Descargar el Proyecto

**Opción A: Clonar con Git (recomendado)**
```bash
# Abre una terminal (CMD, PowerShell, Git Bash)
# Navega a la carpeta donde quieres guardar el proyecto
cd Documentos

# Clona el repositorio (reemplaza con tu URL)
git clone https://github.com/TU_USUARIO/sistemas_digitales.git

# Entra a la carpeta del proyecto
cd sistemas_digitales
```

**Opción B: Descargar ZIP**
1. En GitHub, haz clic en el botón verde "Code"
2. Selecciona "Download ZIP"
3. Extrae el archivo ZIP en una carpeta de tu elección
4. Abre una terminal en esa carpeta

### Paso 2: Instalar Dependencias

Las dependencias son las librerías que el proyecto necesita para funcionar.

```bash
# Asegúrate de estar en la carpeta del proyecto
# Ejecuta:
npm install
```

Este comando leerá el archivo `package.json` e instalará todas las dependencias necesarias. Puede tomar algunos minutos.

**¿Qué hace este comando?**
- Descarga todas las librerías listadas en `package.json`
- Las guarda en una carpeta llamada `node_modules`
- Crea un archivo `package-lock.json` con las versiones exactas

---

## 🔥 Configuración de Firebase

Firebase es donde se almacenan los datos del sensor en tiempo real.

### Paso 1: Crear Base de Datos

1. Ve a [console.firebase.google.com](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **"Realtime Database"**
4. Haz clic en **"Crear base de datos"**
5. Selecciona una ubicación (ejemplo: us-central1)
6. Selecciona **"Modo de prueba"** (para desarrollo) o configura reglas personalizadas

### Paso 2: Configurar Reglas de Seguridad

Las reglas controlan quién puede leer/escribir en tu base de datos.

1. En Realtime Database, ve a la pestaña **"Reglas"**
2. Para desarrollo, puedes usar estas reglas (⚠️ **NO usar en producción**):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

3. Para producción segura, usa reglas con autenticación:
   ```json
   {
     "rules": {
       ".read": "auth.uid === 'TU_USER_ID'",
       ".write": "auth.uid === 'TU_USER_ID'"
     }
   }
   ```

### Paso 3: Obtener Credenciales

1. En Firebase Console, haz clic en el ícono de **engranaje** ⚙️ (Configuración del proyecto)
2. Desplázate hasta **"Tus apps"**
3. Si no tienes una app web, haz clic en **"</>"** (icono web)
4. Registra tu app (puedes llamarla "Monitor TDS")
5. Copia el objeto `firebaseConfig` que aparece

### Paso 4: Configurar en tu Proyecto

1. Abre el archivo `src/firebase.js` en tu editor de código
2. Reemplaza las credenciales con las tuyas:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};
```

3. Si usas autenticación, también actualiza en `src/App.jsx` (línea ~18):
```javascript
await signInWithEmailAndPassword(
  auth,
  'tu-email@gmail.com',  // Tu email de Firebase
  'tu-contraseña'        // Tu contraseña
)
```

---

## 🔌 Configuración del ESP32

El ESP32 es el microcontrolador que lee el sensor TDS y envía datos a Firebase.

### Código Arduino/ESP32

El código del ESP32 debe estar configurado con:

1. **Credenciales WiFi**:
   ```cpp
   #define WIFI_SSID "TuRedWiFi"
   #define WIFI_PASSWORD "TuContraseña"
   ```

2. **Credenciales Firebase**:
   ```cpp
   #define WEB_API_KEY "TU_API_KEY"
   #define DATABASE_URL "https://tu-proyecto-default-rtdb.firebaseio.com"
   #define USER_EMAIL "tu-email@gmail.com"
   #define USER_PASS "tu-contraseña"
   ```

3. **Estructura de datos** que envía el ESP32:
   ```json
   {
     "ultima_lectura": {
       "tds": 234.56,
       "voltaje": 0.59,
       "estado": "BUENA / ACEPTABLE",
       "accion": "Monitoreo en tiempo real",
       "fecha": {
         "dia": 14,
         "mes": 12,
         "anio": 2025
       },
       "hora": {
         "hora": 23,
         "minuto": 23,
         "segundo": 3
       }
     },
     "historial": {
       "1765771614": {
         "tds": 198.48,
         "voltaje": 0.52,
         "estado": "BUENA / ACEPTABLE",
         "accion": "Monitoreo en tiempo real",
         "timestamp": 1765771614
       }
     }
   }
   ```

---

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo

Este modo es para cuando estás trabajando en el proyecto. Los cambios se reflejan automáticamente.

```bash
# Asegúrate de estar en la carpeta del proyecto
npm run dev
```

**¿Qué verás?**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**¿Qué hacer ahora?**
1. Abre tu navegador web (Chrome, Firefox, Edge)
2. Ve a la dirección: `http://localhost:5173/`
3. ¡Deberías ver tu aplicación funcionando!

**Para detener el servidor:**
- Presiona `Ctrl + C` en la terminal

### Modo Producción

Este modo crea una versión optimizada para publicar en internet.

```bash
# Construir la aplicación
npm run build

# Previsualizar la versión de producción (opcional)
npm run preview
```

Los archivos optimizados se crearán en la carpeta `dist/`.

---

## 📁 Estructura del Proyecto

```
sistemas_digitales/
│
├── public/                 # Archivos públicos estáticos
│
├── src/                    # Código fuente
│   ├── assets/            # Imágenes, íconos, etc.
│   ├── App.jsx            # Componente principal de React
│   ├── App.css            # Estilos del componente principal
│   ├── firebase.js        # Configuración de Firebase
│   ├── main.jsx           # Punto de entrada de la aplicación
│   └── index.css          # Estilos globales
│
├── .gitignore             # Archivos que Git debe ignorar
├── eslint.config.js       # Configuración de ESLint (linter)
├── index.html             # HTML principal
├── package.json           # Dependencias y scripts del proyecto
├── postcss.config.js      # Configuración de PostCSS
├── README.md              # Este archivo
├── tailwind.config.js     # Configuración de Tailwind CSS
└── vite.config.js         # Configuración de Vite
```

### Archivos Clave

- **`src/App.jsx`**: Contiene toda la lógica de la aplicación (componentes, estados, efectos)
- **`src/firebase.js`**: Configuración y conexión con Firebase
- **`package.json`**: Lista de dependencias y comandos disponibles
- **`vite.config.js`**: Configuración del servidor de desarrollo

---

## 📊 Escala de Clasificación TDS

El sistema clasifica el agua según los niveles de TDS en partes por millón (ppm):

| Rango (ppm) | Clasificación | Color | Descripción |
|-------------|---------------|-------|-------------|
| 0-50 | Agua muy pura | 🔵 Azul claro | Agua destilada o de ósmosis inversa |
| 51-150 | Excelente | 🟢 Verde | Agua tratada de alta calidad |
| 151-300 | Buena/Aceptable | 🔵 Azul | Agua potable normal |
| 301-500 | Moderada | 🟡 Amarillo | Agua dura pero apta según OMS |
| 501-1000 | Deficiente | 🟠 Naranja | Evitar consumo prolongado |
| 1001-2000 | Muy deficiente | 🔴 Rojo | No apta para consumo |
| >2000 | Crítica | 🔴 Rojo oscuro | Posible agua salobre o contaminada |

---

## 🎯 Características Avanzadas

### Sistema de Alertas

- Las alertas aparecen automáticamente cuando TDS > 1000 ppm
- Cada alerta permanece 5 segundos en pantalla
- Máximo 4 alertas simultáneas
- Si llega una 5ª alerta, la primera se elimina automáticamente
- Animaciones suaves de entrada y salida

### Paginación del Historial

- 20 registros por página
- Navegación con botones "Anterior" y "Siguiente"
- Acceso directo a cualquier página
- Indicador de página actual y total

### Exportación a Excel

- Exporta todo el historial con un clic
- Archivo incluye: fecha, hora, TDS, clasificación, explicación, voltaje y acción
- Columnas autoajustadas para mejor lectura
- Nombre de archivo con fecha actual

### Ordenamiento Inteligente

- Mediciones normales (TDS ≤ 1000) primero
- Mediciones críticas (TDS > 1000) al final
- Dentro de cada grupo: orden cronológico descendente

---

## 🔧 Solución de Problemas

### La aplicación no se conecta a Firebase

**Problema**: Aparece "Desconectado" en el header

**Soluciones**:
1. Verifica que las credenciales en `src/firebase.js` sean correctas
2. Asegúrate de que las reglas de Firebase permitan acceso
3. Si usas autenticación, verifica email y contraseña en `src/App.jsx`
4. Revisa la consola del navegador (F12) para ver errores específicos
5. Intenta hacer un hard refresh: `Ctrl + Shift + R` o `Ctrl + F5`

### No aparece el historial

**Problema**: "No hay datos en el historial"

**Soluciones**:
1. Verifica que tu ESP32 esté enviando datos a Firebase
2. En Firebase Console, verifica que exista la ruta `/historial`
3. Asegúrate de que los datos tengan la estructura correcta (ver sección ESP32)
4. Revisa la consola del navegador para ver logs

### El ESP32 no envía datos

**Problema**: El ESP32 no se conecta o no envía mediciones

**Soluciones**:
1. Verifica las credenciales WiFi en el código del ESP32
2. Asegúrate de que el ESP32 esté conectado a internet
3. Revisa el Serial Monitor del Arduino IDE para ver mensajes de error
4. Verifica que las credenciales de Firebase en el ESP32 sean correctas

### Errores al instalar dependencias

**Problema**: `npm install` falla

**Soluciones**:
1. Asegúrate de tener Node.js instalado: `node --version`
2. Intenta limpiar la caché: `npm cache clean --force`
3. Elimina la carpeta `node_modules` y `package-lock.json`, luego ejecuta `npm install` nuevamente
4. Verifica que no haya restricciones de permisos en la carpeta

### La aplicación no carga en el navegador

**Problema**: Error al abrir `http://localhost:5173/`

**Soluciones**:
1. Verifica que el servidor esté corriendo (deberías ver mensajes en la terminal)
2. Prueba otro puerto: `npm run dev -- --port 3000`
3. Revisa si otro programa está usando el puerto 5173
4. Intenta en modo incógnito del navegador

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar este proyecto:

1. **Fork** el repositorio
2. Crea una **rama** para tu función: `git checkout -b feature/nueva-funcion`
3. **Commit** tus cambios: `git commit -m 'Agrega nueva función'`
4. **Push** a la rama: `git push origin feature/nueva-funcion`
5. Abre un **Pull Request**

### Directrices

- Escribe código limpio y documentado
- Sigue las convenciones de estilo del proyecto
- Prueba tus cambios antes de hacer commit
- Actualiza la documentación si es necesario

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Esto significa que puedes:

✅ Usar el código comercialmente  
✅ Modificar el código  
✅ Distribuir el código  
✅ Uso privado  

Siempre que incluyas el aviso de copyright y la licencia.

---

## 👥 Autores

- **Gabriel Cardenas** - Desarrollo inicial

---

## 🙏 Agradecimientos

- Firebase por la plataforma de base de datos en tiempo real
- React y Vite por las herramientas de desarrollo
- Tailwind CSS por el framework de estilos
- La comunidad de código abierto

---

## 📞 Contacto

¿Tienes preguntas o sugerencias? ¡Contáctame!

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: gabrielcardenassanchez80@gmail.com

---

**¡Gracias por usar este sistema de monitoreo de calidad del agua!** 💧✨
