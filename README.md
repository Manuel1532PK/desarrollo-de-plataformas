````markdown
# 📌 Billetera Virtual Persona

Este proyecto implementa una API para la gestión de una billetera virtual, permitiendo registro de usuarios, autenticación, manejo de cuentas, transferencias, depósitos y retiros.  

---

## 🚀 Endpoints disponibles

### 🔐 Autenticación
| Método | URL | Descripción |
|--------|-----|-------------|
| **GET** | `www.billeteraVirtualPersona.com/home` | El usuario puede ingresar al sitio y registrarse o entrar con su cuenta. |
| **POST** | `www.billeteraVirtualPersona.com/auth/register` | URL de autenticación de registros, para crear una cuenta. |
| **POST** | `www.billeteraVirtualPersona.com/auth/login` | URL de autenticación de Login, para ingresar a la cuenta. |
| **POST** | `www.billeteraVirtualPersona.com/auth/forgot-password` | El usuario solicita un reset de la contraseña mediante el correo (se envía un token para restablecerla). |
| **POST** | `www.billeteraVirtualPersona.com/auth/reset_password` | Restablecer contraseña: el usuario mediante un token crea y envía una nueva contraseña. |

---

### 💰 Cuenta
| Método | URL | Descripción |
|--------|-----|-------------|
| **GET** | `www.billeteraVirtualPersona.com/account/balance` | Obtiene o consulta el balance del usuario. |
| **POST** | `www.billeteraVirtualPersona.com/account/transfer` | Permite realizar transferencias. |
| **POST** | `www.billeteraVirtualPersona.com/account/transfer/history` | Consulta el historial de transferencias realizadas. |
| **POST** | `www.billeteraVirtualPersona.com/account/withdraw` | Permite realizar retiros de la cuenta. |
| **GET** | `www.billeteraVirtualPersona.com/account/withdraw/history` | Consulta el historial de retiros realizados. |
| **POST** | `www.billeteraVirtualPersona.com/account/deposit` | Permite realizar depósitos en la cuenta. |
| **GET** | `www.billeteraVirtualPersona.com/account/deposit/history` | Consulta el historial de depósitos realizados. |
| **GET** | `www.billeteraVirtualPersona.com/account/transactions` | Consulta el historial completo de transferencias, retiros y depósitos. |
| **POST** | `www.billeteraVirtualPersona.com/account/logout` | Cerrar sesión del usuario. |

---

### 👤 Usuarios
| Método | URL | Descripción |
|--------|-----|-------------|
| **PUT** | `www.billeteraVirtualPersona.com/users/updatepassword/ID=?` | El usuario (con sesión iniciada) puede actualizar su contraseña mediante su ID. |
| **PUT** | `www.billeteraVirtualPersona.com/users/update/ID=?` | El usuario puede actualizar su información personal mediante su ID. |
| **GET** | `www.billeteraVirtualPersona.com/users/profile/ID=?` | Permite consultar la información del usuario mediante su ID. |

---

## ⚙️ Instalación

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install express nodemon dotenv mysql2
````

---

## ▶️ Inicializar el servidor

Para iniciar el servidor en modo normal o desarrollo:

```bash
npm run start
```

o en modo desarrollo (con **nodemon**):

```bash
npm run dev
```

> 🔹 Estos comandos sirven para **levantar el servidor** y mantenerlo en ejecución para probar la API.

```

¿Quieres que además le agregue una **sección de ejemplos en Postman** para probar cada endpoint? 🚀
```
