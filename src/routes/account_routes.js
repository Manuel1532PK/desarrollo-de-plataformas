const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account_controller');

router.get('/balance/:userId', accountController.getBalance);
router.get('/transfer/history/:userId', accountController.getTransferHistory);
router.get('/withdraw/history/:userId', accountController.getWithdrawalHistory);
router.get('/deposit/history/:userId', accountController.getDepositHistory);
router.get('/transactions/:userId', accountController.getAllTransactions);

//router.post('/logout', accountController.logout);
router.post('/deposit', accountController.deposit);
router.post('/withdraw', accountController.withdraw);
router.post('/transfer', accountController.transfer);

module.exports = router;
