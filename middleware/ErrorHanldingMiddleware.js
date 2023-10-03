const ApiError = require('../error/ApiError')

// Експортуємо middleware функцію, яка приймає параметр `err`.
module.exports = function (err, req, res, next) {
    // Перевіряємо, чи отримана помилка є екземпляром класу ApiError.
    if (err instanceof ApiError) {
        // Якщо так, то повертаємо відповідь зі статусом та повідомленням про помилку з об'єкта ApiError.
        return res.status(err.status).json({message: err.message});
    }
    // Якщо помилка не є екземпляром ApiError, то ми вважаємо її непередбаченою і повертаємо стандартне повідомлення про помилку зі статусом 500.
    return res.status(500).json({message: "Непередбачена помилка"});
}
