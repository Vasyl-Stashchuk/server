const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController'); // Підключення контролера пристроїв
const checkRole = require("../middleware/checkRoleMiddleware"); // Підключення middleware для перевірки ролі користувача

// Маршрут для створення нового пристрою (доступний тільки адміністратору)
router.post('/', checkRole('ADMIN'), deviceController.create);

// Маршрут для отримання списку всіх пристроїв
router.get('/', deviceController.getAll);

// Маршрут для отримання інформації про один пристрій за його ідентифікатором
router.get('/:id', deviceController.getOne);

router.delete('/:id', checkRole('ADMIN'), deviceController.delete);


module.exports = router;
