const {Brand, Type} = require('../models/models'); // Імпорт моделей "Brand" і "Type" з файлу "models".
const ApiError = require('../error/ApiError'); // Імпорт класу "ApiError" для обробки помилок.

class BrandController {
    // Метод "create" призначений для створення нового бренду.
    async create(req, res) {
        const {name} = req.body; // Отримання назви бренду з запиту.
        const brand = await  Brand.create({name}); // Створення нового бренду з вказаною назвою в базі даних.
        return res.json(brand); // Відповідь сервера у форматі JSON з новоствореним брендом.
    }

    // Метод "getAll" призначений для отримання списку всіх брендів.
    async getAll(req, res) {
        const brands = await  Brand.findAll(); // Отримання всіх існуючих брендів з бази даних.
        return res.json(brands); // Відповідь сервера у форматі JSON зі списком брендів.
    }
}

module.exports = new BrandController(); // Експорт створеного екземпляра контролера брендів для використання в інших частинах додатка.
