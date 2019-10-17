# firebase-login-express

Aplicación hecha con [expressjs](http://expressjs.com/) para el [Curso de NodeJS](https://github.com/Fictizia/Curso-Node.js-para-desarrolladores-Front-end_ed5) de [@Fictizia](https://github.com/Fictizia);

El objetivo es crear una aplicación web que permita autenticarse, subir ficheros y redimensionarlos utilizando los servicios de Firebase.

## Instalación

> Por defecto la aplicación arrancará en el puerto **8080**.

```
git clone https://github.com/josex2r/firebase-login-express.git
cd firebase-login-express
npm install
npm start
```

## Configuración Google Cloud

Rellena el fichero `.env` con los valores de de tu proyecto de Firebase:
```
API_KEY=XXXXXXX
AUTH_DOMAIN=XXXXXXX
DATABASE_URL=XXXXXXX
PROJECT_ID=XXXXXXX
STORAGE_BUCKET=XXXXXXX
MESSAGING_SENDER_ID=XXXXXXX
APP_ID=XXXXXXX
```

Crea el fichero `serviceAccountKey.json` con el fichero descargado de Firebase (Settings > Service Account).

## Contenido

La aplicación contiene las siguientes rutas:

- **Rutas públicas (sin autenticación)**
  - [`/`](routes/index.js)
  - [`/login`](routes/login.js)
  - [`/logout`](routes/login.js)
- **Rutas privadas (con autenticación)**
  - [`/admin`](routes/admin.js)
