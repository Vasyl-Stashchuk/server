const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController'); // Підключення контролера брендів
const checkRole = require("../middleware/checkRoleMiddleware"); // Підключення middleware для перевірки ролі користувача

// Маршрут для створення нового бренду (доступний тільки адміністратору)
router.post('/', checkRole('ADMIN'), brandController.create);

// Маршрут для отримання всіх брендів
router.get('/', brandController.getAll);

module.exports = router;
