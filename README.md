# EduBank Backend

Backend de la plataforma **EduBank**, una aplicación orientada a la gestión de un banco de preguntas educativas y la generación de evaluaciones.

El backend proporciona una **API REST** para administrar usuarios, preguntas, categorías, evaluaciones y demás recursos necesarios para el funcionamiento de la plataforma.

---

## 🚀 Tecnologías

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Token)**
- **bcryptjs**
- **dotenv**
- **express-validator**
- **CORS**

---

## 📋 Requisitos

Antes de ejecutar el proyecto necesitas tener instalado:

- Node.js
- npm
- MongoDB o una cuenta en MongoDB Atlas
- Git

Puedes comprobar las versiones instaladas con:

```bash
node --version
npm --version
git --version
```

---

## 📁 Estructura del proyecto

```text
EduBank_Backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── helpers/
│
├── uploads/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── index.js
└── README.md
```

> La estructura puede cambiar conforme se incorporen nuevos módulos y funcionalidades al sistema.

---

## ⚙️ Instalación

Clona el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entra al directorio del proyecto:

```bash
cd EduBank_Backend
```

Instala las dependencias:

```bash
npm install
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000

MONGODB_URI=mongodb://localhost:27017/edubank

JWT_SECRET=tu_clave_secreta

NODE_ENV=development
```

Si utilizas **MongoDB Atlas**, coloca la cadena de conexión correspondiente:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/edubank
```

## ▶️ Ejecución del proyecto

Para ejecutar el servidor en modo desarrollo:

```bash
npm run dev
```

Para ejecutar el proyecto:

```bash
npm start
```

Por defecto, el servidor estará disponible en:

```text
http://localhost:3000
```

---

## 🔌 API REST

La API seguirá una arquitectura REST y estará organizada por módulos.

Ejemplo de estructura:

```text
/api/auth
/api/usuarios
/api/preguntas
/api/categorias
/api/evaluaciones
```

Los endpoints definitivos serán documentados conforme se implemente cada módulo.

---

## 📚 Módulos principales

### 🔐 Autenticación

Responsable de:

- Registro de usuarios.
- Inicio de sesión.
- Generación de tokens JWT.
- Validación de usuarios.
- Control de acceso.

### 👤 Usuarios

Permite administrar:

- Usuarios.
- Roles.
- Información de perfil.
- Estado de los usuarios.

### ❓ Banco de preguntas

Permitirá gestionar preguntas educativas con información como:

- Enunciado.
- Tipo de pregunta.
- Nivel educativo.
- Asignatura.
- Categoría.
- Dificultad.
- Respuestas.
- Respuesta correcta.
- Autor.
- Estado.

### 📝 Evaluaciones

Permitirá:

- Crear evaluaciones.
- Seleccionar preguntas.
- Configurar cantidad de preguntas.
- Generar evaluaciones.
- Administrar evaluaciones existentes.

### 📄 Generación de documentos

El sistema contempla la generación de evaluaciones en formato PDF para su posterior impresión o distribución.

---

## 🗄️ Base de datos

EduBank utiliza **MongoDB** como sistema gestor de base de datos y **Mongoose** como ODM para trabajar con las colecciones y documentos.

La conexión a la base de datos se configura mediante:

```env
MONGODB_URI=
```

---

## 🔒 Seguridad

El backend implementará diferentes mecanismos de seguridad:

- Autenticación mediante JWT.
- Contraseñas almacenadas mediante hash.
- Variables sensibles mediante `.env`.
- Validación de datos.
- Middleware de autenticación.
- Control de acceso basado en roles.
- CORS.
- Protección de rutas privadas.

---

## 🧪 Pruebas de la API

Durante el desarrollo se recomienda utilizar herramientas como:

- Postman
- Insomnia
- Thunder Client

Ejemplo de solicitud:

```http
GET /api/preguntas
```

Los endpoints serán documentados conforme avance el desarrollo de la API.

---

## 🛠️ Scripts disponibles

Los scripts principales del proyecto son:

```bash
npm start
npm run dev
```

Puedes consultar todos los scripts disponibles mediante:

```bash
npm run
```

---

## 🌿 Flujo de trabajo con Git

Se recomienda utilizar ramas para organizar el desarrollo:

```text
main
│
├── develop
│
├── feature/autenticacion
├── feature/usuarios
├── feature/preguntas
└── feature/evaluaciones
```

Ejemplo:

```bash
git checkout -b feature/preguntas
```

Después de realizar los cambios:

```bash
git add .
git commit -m "feat: agregar modulo de preguntas"
git push origin feature/preguntas
```

---

## 📌 Estado del proyecto

**En desarrollo 🚧**

EduBank Backend se encuentra actualmente
