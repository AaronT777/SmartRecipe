// server/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Restaurant routes
router.get('/nearby', restaurantController.getNearbyRestaurants);

module.exports = router;