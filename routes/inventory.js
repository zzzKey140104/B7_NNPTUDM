const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');

// GET
router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getById);

// POST
router.post('/add-stock', inventoryController.addStock);
router.post('/remove-stock', inventoryController.removeStock);
router.post('/reservation', inventoryController.reservation);
router.post('/sold', inventoryController.sold);

module.exports = router;