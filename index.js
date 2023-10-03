require('dotenv').config(); // Підключення бібліотеки для роботи з оточенням

const express = require('express'); // Підключення бібліотеки Express.js
const sequelize = require('./db'); // Підключення об'єкта sequelize для роботи з базою даних
const models = require('./models/models'); // Підключення моделей даних
const cors = require('cors'); // Підключення бібліотеки для обробки CORS
const fileUpload = require('express-fileupload'); // Підключення бібліотеки для завантаження файлів
const router = require('./routes/index'); // Підключення маршрутів (routes)
const errorHandler = require('./middleware/ErrorHanldingMiddleware'); // Підключення middleware для обробки помилок
const path = require('path'); // Підключення модуля path для роботи з шляхами файлів
const pg = require('pg');

const PORT = process.env.PORT || 5000; // Встановлення порту для сервера, отриманого з оточення або за замовчуванням 5000

const app = express(); // Створення екземпляру Express

app.use(cors()); // Використання middleware cors для обробки CORS запитів
app.use(express.json()); // Використання middleware для обробки JSON-даних у запитах
const staticPath = process.pkg ? path.join(path.dirname(process.execPath), 'static') : path.join(__dirname, 'static');
app.use(express.static(staticPath));// Встановлення шляху до статичних файлів (наприклад, зображень)
app.use(fileUpload({})); // Використання middleware для завантаження файлів у запитах
app.use('/api', router); // Використання маршрутів, починаючи з '/api'

// Middleware для обробки помилок (повинен бути в останній черзі)
app.use(errorHandler);

console.log("Шлях до папки static:", staticPath);


// Функція для запуску сервера
const start = async () => {
    try {
        await sequelize.authenticate(); // Перевірка з'єднання з базою даних
        await sequelize.sync(); // Синхронізація моделей бази даних
        app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`)); // Запуск сервера на вказаному порту
    } catch (e) {
        console.log(e); // Обробка можливих помилок під час запуску сервера
    }
}

start(); // Виклик функції для запуску сервера
