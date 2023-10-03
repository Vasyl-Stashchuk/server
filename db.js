const { Sequelize } = require('sequelize'); // Підключення бібліотеки Sequelize

// Експорт інстанції Sequelize, яка буде використовуватися для з'єднання з базою даних
module.exports = new Sequelize(
    process.env.DB_NAME, // Назва бази даних, отримана з оточення
    process.env.DB_USER, // Користувач бази даних, отриманий з оточення
    process.env.DB_PASSWORD, // Пароль користувача бази даних, отриманий з оточення
    {
        dialect: 'postgres', // Використовуваний діалект (PostgreSQL у даному випадку)
        host: process.env.DB_HOST, // Хост бази даних, отриманий з оточення
        port: process.env.DB_PORT // Порт, на якому працює база даних, отриманий з оточення
    }
);
