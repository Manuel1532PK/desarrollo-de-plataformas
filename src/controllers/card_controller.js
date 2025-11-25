const cardService = require('../services/card_service');

// Agregar nueva tarjeta
exports.addCard = async (req, res) => {
    try {
        const newCard = await cardService.addCard(req.params.userId, req.body);
        res.status(201).json(newCard);
    } catch (error) {
        if (error.message.includes('no existe')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El número de tarjeta ya está registrado' });
        }
        res.status(500).json({ message: "Error al agregar tarjeta", error: error.message });
    }
};

// Listar tarjetas
exports.listCards = async (req, res) => {
    try {
        const cards = await cardService.listCards(req.params.userId);
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ message: "Error al listar tarjetas", error: error.message });
    }
};

// Actualizar tarjeta
exports.updateCard = async (req, res) => {
    try {
        const updatedCard = await cardService.updateCard(req.params.cardId, req.body);
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar tarjeta", error: error.message });
    }
};

// Eliminar tarjeta
exports.deleteCard = async (req, res) => {
    try {
        await cardService.deleteCard(req.params.cardId);
        res.status(200).json({ message: "Tarjeta eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar tarjeta", error: error.message });
    }
};

// Obtener tarjeta por ID
exports.getCard = async (req, res) => {
    try {
        const card = await cardService.getCardById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ message: "Tarjeta no encontrada" });
        }
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tarjeta", error: error.message });
    }
};