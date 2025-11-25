const express = require('express');
const userRoutes = require('./routes/user_routes');
const accountRoutes = require('./routes/account_routes');
const authRoutes = require('./routes/auth_routes');
const transferenceRoutes = require('./routes/transference_routes');
const SmartContractsRoutes = require('./routes/smartcontracts_routes');
const cardRoutes = require('./routes/card_routes');
const historialRoutes = require('./routes/history_routes');
const path = require('path');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// Prefijo de la API y montaje de las rutas
app.use('/api/users', userRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transference', transferenceRoutes);
app.use('/api/smartcontracts', SmartContractsRoutes);
app.use('/api/history', historialRoutes);
app.use('/api/cards', cardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

//fixed 
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        error: {
            message: error.message || 'Internal Server Error'
        }
    });
});


// Server configuration
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Start Server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('---------------------------------------');
    console.log('API de Servicios Billetera Virtual');
    console.log('---------------------------------------');
    console.log('Rutas disponibles:');
    console.log('------------------👤users------------------');
    console.log('Usuarios: /api/users');
    console.log('POST /api/users/create → Crear usuario');
    console.log('GET /api/users/profile → Obtener perfil');
    console.log('PUT /api/users/:id/updatepassword → Actualizar contraseña');
    console.log('PUT PUT /api/users/:id → Actualizar usuario');
    console.log('GET /api/users/ → Listar usuarios');
    console.log('------------------account------------------');
    console.log('Cuentas: /api/account');
    console.log('GET /api/account/balance/:userId → Obtener saldo');
    console.log('GET /api/account/AllTransactions/:userId → Obtener todas las transacciones');
    console.log('------------------🔑auth------------------');
    console.log('Autenticación: /api/auth');
    console.log('POST /api/auth/register → Registrar usuario');
    console.log('POST /api/auth/login → Login usuario');
    console.log('POST /api/auth/forgot_password → Solicitar reset de password');
    console.log('POST /api/auth/reset_password → Resetear password');
    console.log('------------------🔄transference------------------');
    console.log('Transferencias: /api/transference');
    console.log('POST /api/transference/transfer/:userId → Realizar transferencia');
    console.log('POST /api/transference/deposit/:userId → Realizar depósito');
    console.log('POST /api/transference/withdraw/:userId → Realizar retiro');
    console.log('------------------🔗smartcontracts------------------');
    console.log('Contratos Inteligentes: /api/smartcontracts');
    console.log('POST /api/smartcontracts/create/:userId → Crear contrato');
    console.log('POST /api/smartcontracts/list/:userId → Listar contratos');
    console.log('GET /api/smartcontracts/:contractId → Obtener contrato por ID');
    console.log('PUT /api/smartcontracts/:contractId/update → Actualizar contrato');
    console.log('DELETE /api/smartcontracts/:contractId/delete → Eliminar contrato');
    console.log('------------------📜history------------------');
    console.log('Historial: /api/history');
    console.log('GET /api/history/tranfer/history/:userId → Historial de transferencias');
    console.log('GET /api/history/withdraw/history/:userId → Historial de retiros')
    console.log('GET /api/history/deposit/history/:userId → Historial de depósitos');
    console.log('------------------💳cards------------------');
    console.log('Tarjetas: /api/cards');
    console.log('POST /api/cards/create/:userId → Crear tarjeta');
    console.log('GET /api/cards/user/:userId → Obtener tarjetas de un usuario');
    console.log('PUT /api/cards/:cardId/update → Actualizar tarjeta');
    console.log('DELETE /api/cards/:cardId/delete → Eliminar tarjeta');
    console.log('---------------------------------------');
});