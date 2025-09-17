const db = require('../config/db_config');

// Obtener saldo de la billetera del usuario
exports.getBalance = async (userId) => {
        const [rows] = await db.execute(`
            SELECT Billeteras.Moneda, Billeteras.Saldo 
            FROM Billeteras
            INNER JOIN Transacciones ON Billeteras.ID_Billetera = Transacciones.Billeteras_ID_Billetera
            WHERE Transacciones.Usuarios_ID_Usuarios = ?
            ORDER BY Transacciones.Fecha_Transaccion 
        `, [userId]);
        
        return rows[0] || { Moneda: 'USD', Saldo: 0 };
};

// Obtener historial de transferencias
exports.getTransferHistory = async (userId) => {
        const [rows] = await db.execute(`
            SELECT Transacciones.*, Billeteras.Moneda 
            FROM Transacciones
            INNER JOIN Billeteras ON Transacciones.Billeteras_ID_Billetera = Billeteras.ID_Billetera
            WHERE Transacciones.Usuarios_ID_Usuarios = ? AND Transacciones.Tipo_Transaccion = 'transferencia'
            ORDER BY Transacciones.Fecha_Transaccion
        `, [userId]);
        
        return rows
};

// Obtener historial de retiros
exports.getWithdrawalHistory = async (userId) => {
        const [rows] = await db.execute(`
            SELECT Transacciones.*, Billeteras.Moneda 
            FROM Transacciones
            INNER JOIN Billeteras ON Transacciones.Billeteras_ID_Billetera = Billeteras.ID_Billetera
            WHERE Transacciones.Usuarios_ID_Usuarios = ? AND Transacciones.Tipo_Transaccion = 'retiro'
            ORDER BY Transacciones.Fecha_Transaccion
        `, [userId]);
        
        return rows;
};

// Obtener historial de depósitos
exports.getDepositHistory = async (userId) => {
        const [rows] = await db.execute(`
            SELECT Transacciones.*, Billeteras.Moneda 
            FROM Transacciones
            INNER JOIN Billeteras ON Transacciones.Billeteras_ID_Billetera = Billeteras.ID_Billetera
            WHERE Transacciones.Usuarios_ID_Usuarios = ? AND Transacciones.Tipo_Transaccion = 'deposito'
            ORDER BY Transacciones.Fecha_Transaccion
        `, [userId]);
        
        return rows;
};

// Obtener todas las transacciones
exports.getAllTransactions = async (userId) => {
        const [rows] = await db.execute(`
            SELECT Transacciones.*, Billeteras.Moneda 
            FROM Transacciones
            INNER JOIN Billeteras ON Transacciones.Billeteras_ID_Billetera = Billeteras.ID_Billetera
            WHERE Transacciones.Usuarios_ID_Usuarios = ?
            ORDER BY Transacciones.Fecha_Transaccion
        `, [userId]);
        
        return rows;
};

// Realizar transferencia
exports.transfer = async (transferData) => {
    try {
        transferData = { usuario_origen, usuario_destino, monto, moneda, descripcion } ;
        
        // 1. Verificar saldo suficiente
        const [saldoRows] = await db.execute(
            'SELECT Saldo FROM Billeteras WHERE Usuarios_ID_Usuarios = ? AND Moneda = ?',
            [usuario_origen, moneda]
        );

        return saldoRows

        //opciones a futuro

        // 2. Iniciar transacción
        // 3. Restar del usuario origen
        // 4. Sumar al usuario destino (o crear billetera si no existe)
        // 5. Registrar transacción de transferencia

    } catch (error) {
        await db.rollback();
        throw new Error('Error en transferencia: ' + error.message);
    }
};

// Realizar retiro
exports.withdraw = async (withdrawData) => {
    try {
        withdrawData = { usuario_id, monto, moneda, descripcion } ;
        
        // Verificar saldo
        const [saldoRows] = await db.execute(
            'SELECT Saldo, ID_Billetera FROM Billeteras WHERE Usuarios_ID_Usuarios = ? AND Moneda = ?',
            [usuario_id, moneda]
        );

        return saldoRows
        //toca agregar la funcion para que se retire y se registre la transaccion en el historial
        // 1. Realizar retiro
        // 2. Registrar transacción

         } catch (error) {
        throw new Error('Error en retiro: ' + error.message);
    }
};

// Realizar depósito
exports.deposit = async (depositData) => {
    try {
        depositData = { usuario_id, monto, moneda, descripcion };
        
        // Verificar si existe billetera
        const [billeteraRows] = await db.execute(
            'SELECT ID_Billetera FROM Billeteras WHERE Usuarios_ID_Usuarios = ? AND Moneda = ?',
            [usuario_id, moneda]
        );

        return billeteraRows
        
         // 1. Registrar transacción


         } catch (error) {
        throw new Error('Error en retiro: ' + error.message);
    }
};
