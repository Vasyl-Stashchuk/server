const Router = require('express'); // Підключення бібліотеки Express
const router = new Router(); // Створення нового об'єкту маршрутизатора
const typeController = require('../controllers/typeController'); // Підключення контролера для операцій з типами пристроїв
const checkRole = require('../middleware/checkRoleMiddleware');
const deviceController = require("../controllers/deviceController");

// Маршрут для створення нового типу пристрою
router.post('/', checkRole('ADMIN'), typeController.create);

router.get('/:id', typeController.getOne);

// Маршрут для отримання списку всіх типів пристроїв
router.get('/', typeController.getAll);

router.delete('/:id', checkRole('ADMIN'), typeController.delete);

module.exports = router; // Експорт маршрутизатора для використання в додатку
