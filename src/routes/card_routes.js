const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card_controller');

router.post('/create/:userId', cardController.addCard);
router.get('/user/:userId', cardController.listCards);
router.put('/:cardId/update', cardController.updateCard);
router.delete('/:cardId/delete', cardController.deleteCard);;

module.exports = router;