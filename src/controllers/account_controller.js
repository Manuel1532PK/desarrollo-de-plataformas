const accountService = require('../services/account_service');

// Obtener saldo de usuario
exports.getBalance = async (req, res) => {
    try {
        const balance = await accountService.getBalance(req.params.userId);
        res.status(200).json(balance);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener saldo", error });
    }
};

// Realizar transferencia
exports.transfer = async (req, res) => {
    try {
        const transferData = {
            usuario_origen: req.body.usuario_origen,
            usuario_destino: req.body.usuario_destino,
            monto: req.body.monto,
            moneda: req.body.moneda,
            descripcion: req.body.descripcion
        };
        //Se cargaron todas la variables en una constante llamada transferData o transferencia_Datos
        
        const result = await accountService.transfer(transferData);
        res.status(200).json({ 
            message: "Transferencia realizada exitosamente",
            result: result
        });
    } catch (error) {
        res.status(500).json({ message: "Error al realizar transferencia", error });
    }
};

// Realizar retiro
exports.withdraw = async (req, res) => {
    try {
        const withdrawData = { //Se cargaron todas la variables de la base de dato en una sola variable constante 
            usuario_id: req.body.usuario_id,
            monto: req.body.monto,
            moneda: req.body.moneda,
            descripcion: req.body.descripcion
        };
        
        const result = await accountService.withdraw(withdrawData);
        res.status(200).json({ 
            message: "Retiro realizado exitosamente",
            result: result
        });
    } catch (error) {
        res.status(500).json({ message: "Error al realizar retiro", error });
    }
};

// Realizar depósito
exports.deposit = async (req, res) => {
    try {
        const depositData = { //Se cargaron todas la variables de la base de dato en una sola variable constante
            usuario_id: req.body.usuario_id,
            monto: req.body.monto,
            moneda: req.body.moneda,
            descripcion: req.body.descripcion
        };
        
        const result = await accountService.deposit(depositData);
        res.status(200).json({ 
            message: "Depósito realizado exitosamente",
            result: result
        });
    } catch (error) {
        res.status(500).json({ message: "Error al realizar depósito", error });
    }
};

// Obtener historial de transferencias
exports.getTransferHistory = async (req, res) => {
    try {
        const history = await accountService.getTransferHistory(req.params.userId);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial de transferencias", error });
    }
};

// Obtener historial de retiros
exports.getWithdrawalHistory = async (req, res) => {
    try {
        const history = await accountService.getWithdrawalHistory(req.params.userId);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial de retiros", error });
    }
};

// Obtener historial de depósitos
exports.getDepositHistory = async (req, res) => {
    try {
        const history = await accountService.getDepositHistory(req.params.userId);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial de depósitos", error });
    }
};

// Obtener todas las transacciones
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await accountService.getAllTransactions(req.params.userId);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener transacciones", error });
    }
};
