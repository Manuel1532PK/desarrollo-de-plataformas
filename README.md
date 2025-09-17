# 📌 Billetera Virtual Persona

Este proyecto implementa una API para la gestión de una billetera virtual, permitiendo registro de usuarios, autenticación, manejo de cuentas, transferencias, depósitos y retiros.  

---

## 🚀 Endpoints disponibles

### 🔐 Autenticación
- **GET** `/home`  
  👉 El usuario puede ingresar al sitio y registrarse o entrar con su cuenta.

- **POST** `/auth/register`  
  👉 URL de autenticación de registros, para crear una cuenta.

- **POST** `/auth/login`  
  👉 URL de autenticación de Login, para ingresar a la cuenta.

- **POST** `/auth/forgot-password`  
  👉 El usuario solicita un reset de la contraseña mediante el correo (se envía un token para restablecerla).

- **POST** `/auth/reset_password`  
  👉 Restablecer contraseña: el usuario mediante un token crea y envía una nueva contraseña.

---

### 💰 Cuenta
- **GET** `/account/balance`  
  👉 Obtiene o consulta el balance del usuario.

- **POST** `/account/transfer`  
  👉 Permite realizar transferencias.

- **POST** `/account/transfer/history`  
  👉 Consulta el historial de transferencias realizadas.

- **POST** `/account/withdraw`  
  👉 Permite realizar retiros de la cuenta.

- **GET** `/account/withdraw/history`  
  👉 Consulta el historial de retiros realizados.

- **POST** `/account/deposit`  
  👉 Permite realizar depósitos en la cuenta.

- **GET** `/account/deposit/history`  
  👉 Consulta el historial de depósitos realizados.

- **GET** `/account/transactions`  
  👉 Consulta el historial completo de transferencias, retiros y depósitos.

- **POST** `/account/logout`  
  👉 Cierra sesión del usuario.

---

### 👤 Usuarios
- **PUT** `/users/updatepassword/ID=?`  
  👉 El usuario (con sesión iniciada) puede actualizar su contraseña mediante su ID.

- **PUT** `/users/update/ID=?`  
  👉 El usuario puede actualizar su información personal mediante su ID.

- **GET** `/users/profile/ID=?`  
  👉 Permite consultar la información del usuario mediante su ID.

---

## ⚙️ Instalación

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install express nodemon dotenv mysql2

```

> 🔹 Estos comandos sirven para **levantar el servidor** y mantenerlo en ejecución para probar la API.

```
