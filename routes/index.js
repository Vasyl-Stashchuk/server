const Router = require('express'); // Підключення бібліотеки Express
const router = new Router(); // Створення нового об'єкту маршрутизатора

// Підключення підмаршрутизаторів для різних функціональних частин додатку
const deviceRouter = require('./deviceRouter'); // Маршрутизатор для операцій з пристроями
const userRouter = require('./userRouter'); // Маршрутизатор для операцій з користувачами
const brandRouter = require('./brandRouter'); // Маршрутизатор для операцій з брендами
const typeRouter = require('./typeRouter'); // Маршрутизатор для операцій з типами пристроїв

// Використання підмаршрутизаторів за відповідними URL-шляхами
router.use('/user', userRouter); // Усі URL-шляхи, починаючи з '/user', відправляються до маршрутизатора userRouter
router.use('/type', typeRouter); // Усі URL-шляхи, починаючи з '/type', відправляються до маршрутизатора typeRouter
router.use('/brand', brandRouter); // Усі URL-шляхи, починаючи з '/brand', відправляються до маршрутизатора brandRouter
router.use('/device', deviceRouter); // Усі URL-шляхи, починаючи з '/device', відправляються до маршрутизатора deviceRouter

module.exports = router; // Експорт головного маршрутизатора для використання в основному файлі додатку
