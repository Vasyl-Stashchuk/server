const {Type} = require('../models/models'); // Імпорт моделі "Type" з файлу "models".
const ApiError = require('../error/ApiError'); // Імпорт класу "ApiError" для обробки помилок.

class TypeController {
    // Метод "create" призначений для створення нового типу.
    async create(req, res) {
        const {name} = req.body; // Отримання назви типу з тіла запиту.
        const type = await Type.create({name}); // Створення нового типу в базі даних.
        return res.json(type); // Відповідь сервера у форматі JSON з новим типом.
    }

    // Метод "getAll" призначений для отримання списку всіх типів.
    async getAll(req, res) {
        const types = await Type.findAll(); // Отримання всіх типів з бази даних.
        return res.json(types); // Відповідь сервера у форматі JSON зі списком типів.
    }
    async getOne(req, res) {
        const {id} = req.params; // Отримання ідентифікатора пристрою з параметрів запиту.
        const type = await Type.findOne({
                where: {id},
            }
        );
        return res.json(type); // Відповідь сервера у форматі JSON з деталями пристрою.
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params; // Отримайте ідентифікатор пристрою з параметрів запиту.

            // Виконайте операцію видалення пристрою з бази даних (за допомогою методу destroy або findByIdAndDelete, залежно від ORM/бібліотеки, яку ви використовуєте).
            // Приклад з Sequelize:
            const type = await Type.destroy({ where: { id } });

            if (!type) {
                return next(ApiError.notFound(`Device with ID ${id} not found.`));
            }

            // Відповідь сервера з підтвердженням видалення
            return res.json({ message: 'Device deleted successfully' });
        } catch (e) {
            next(ApiError.internalServerError(e.message)); // Обробка помилки та передача її далі через middleware.
        }
    }


}

module.exports = new TypeController(); // Експорт створеного екземпляра контролера типів для використання в інших частинах додатка.
