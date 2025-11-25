const connection = require('../config/db_config');

// Crear nueva tarjeta
exports.addCard = async (userId, cardData) => {
    try {
        const [userRows] = await connection.execute(
            'SELECT * FROM Usuarios WHERE ID_Usuarios = ?',
            [userId]
        );

        if (userRows.length === 0) {
            throw new Error('El usuario especificado no existe');
        }

        const [result] = await connection.execute(
            'INSERT INTO Tarjetas_Registro (ID_Usuario, Nombre, Tipo_tarjeta, Banco, Numero, Saldo) VALUES (?, ?, ?, ?, ?, ?)',
            [
                userId, 
                cardData.Nombre,
                cardData.Tipo_tarjeta, 
                cardData.Banco,
                cardData.Numero,
                cardData.Saldo || 0.00
            ]
        );
        
        return {
            ID_Tarjetas: result.insertId,
            ID_Usuario: userId,
            Nombre: cardData.Nombre,
            Tipo_tarjeta: cardData.Tipo_tarjeta,
            Banco: cardData.Banco,
            Numero: cardData.Numero,
            Saldo: cardData.Saldo || 0.00,
            Estado: 'Activa',
            mensaje: "Tarjeta registrada exitosamente"
        };
    } catch (error) {
        console.error('Error en agregar tarjeta service:', error);
        throw error;
    }
};

// Listar tarjetas de un usuario
exports.listCards = async (userId) => {
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM Tarjetas_Registro WHERE ID_Usuario = ? AND Estado = "Activa" ORDER BY Fecha_creacion DESC',
            [userId]
        );
        return rows;
    } catch (error) {
        console.error('Error en lista de tarjetas service:', error);
        throw error;
    }
};

// Actualizar tarjeta
exports.updateCard = async (cardId, cardData) => {
    try {
        await connection.execute(
            'UPDATE Tarjetas_Registro SET Nombre = ?, Tipo_tarjeta = ?, Banco = ?, Numero = ?, Saldo = ? WHERE ID_Tarjetas = ?',
            [
                cardData.Nombre,
                cardData.Tipo_tarjeta, 
                cardData.Banco,
                cardData.Numero,
                cardData.Saldo,
                cardId
            ]
        );

        // Obtener la tarjeta actualizada
        const [rows] = await connection.execute(
            'SELECT * FROM Tarjetas_Registro WHERE ID_Tarjetas = ?',
            [cardId]
        );
        return rows[0];
    } catch (error) {
        console.error('Error en actualizar la tarjeta service:', error);
        throw error;
    }
};

// Eliminar tarjeta (soft delete)
exports.deleteCard = async (cardId) => {
    try {
        const [result] = await connection.execute(
            'UPDATE Tarjetas_Registro SET Estado = "Inactiva" WHERE ID_Tarjetas = ?',
            [cardId]
        );
        
        if (result.affectedRows === 0) {
            throw new Error('Tarjeta no encontrada');
        }
        return true;
    } catch (error) {
        console.error('Error en deleteCard service:', error);
        throw error;
    }
};

// Obtener tarjeta por ID
exports.getCardById = async (cardId) => {
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM Tarjetas_Registro WHERE ID_Tarjetas = ?',
            [cardId]
        );
        return rows[0];
    } catch (error) {
        console.error('Error en getCardById service:', error);
        throw error;
    }
};