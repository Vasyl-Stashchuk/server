const Router = require('express'); // Підключення бібліотеки Express
const router = new Router(); // Створення нового об'єкту маршрутизатора

const userController = require('../controllers/userController'); // Підключення контролера для операцій з користувачами
const authMiddleware = require('../middleware/authMiddleware'); // Підключення middleware для автентифікації користувача

// Маршрут для реєстрації нового користувача
router.post('/registration', userController.registration);

// Маршрут для входу користувача
router.post('/login', userController.login);

// Маршрут для перевірки автентифікації користувача
router.get('/auth', authMiddleware, userController.check);

module.exports = router; // Експорт маршрутизатора для використання в додатку
