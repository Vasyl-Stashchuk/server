const ApiError = require('../error/ApiError'); // Імпорт класу "ApiError" для обробки помилок.
const bcrypt = require('bcrypt'); // Імпорт бібліотеки "bcrypt" для хешування паролів.
const jwt = require('jsonwebtoken'); // Імпорт бібліотеки "jsonwebtoken" для створення JWT-токенів.
const {User, Basket} = require('../models/models'); // Імпорт моделей "User" і "Basket" з файлу "models".

// Функція для генерації JWT-токена на основі ідентифікатора користувача, email і ролі.
const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY, // Секретний ключ для підпису JWT-токена.
        {expiresIn: '24h'} // Тривалість дії JWT-токена (24 години).
    );
}

class UserController {
    // Метод "registration" призначений для реєстрації нового користувача.
    async registration(req, res, next) {
        const {email, password, role} = req.body; // Отримання даних з тіла запиту.
        if (!email || !password) {
            return next(ApiError.badRequest('Некоректний email або пароль')); // Обробка помилки у разі відсутності email або пароля.
        }
        const candidate = await User.findOne({where: {email}}); // Пошук користувача за email в базі даних.
        if (candidate) {
            return next(ApiError.badRequest('Користувач з таким email вже існує')); // Обробка помилки у разі, якщо користувач з таким email вже існує.
        }
        const hashPassword = await bcrypt.hash(password, 5); // Хешування пароля з використанням бібліотеки "bcrypt".
        const user = await User.create({email, role, password: hashPassword}); // Створення нового користувача в базі даних.
        await Basket.create({userId: user.id}); // Створення кошика для нового користувача.
        const token = generateJwt(user.id, user.email, user.role); // Генерація JWT-токена для користувача.
        return res.json({token}); // Відповідь сервера у форматі JSON з JWT-токеном.
    }

    // Метод "login" призначений для входу користувача.
    async login(req, res, next) {
        const {email, password} = req.body; // Отримання даних з тіла запиту.
        const user = await User.findOne({where: {email}}); // Пошук користувача за email в базі даних.
        if (!user) {
            return next(ApiError.internal('Користувач не знайдений')); // Обробка помилки у разі відсутності користувача з таким email.
        }
        const comparePassword = bcrypt.compareSync(password, user.password); // Порівняння хешованого пароля з паролем користувача.
        if (!comparePassword) {
            return next(ApiError.internal('Вказано невірний пароль')); // Обробка помилки у разі невірного пароля.
        }
        const token = generateJwt(user.id, user.email, user.role); // Генерація JWT-токена для користувача.
        return res.json({token}); // Відповідь сервера у форматі JSON з JWT-токеном.
    }

    // Метод "check" призначений для перевірки аутентифікації користувача і поновлення JWT-токена.
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({token});
    }
}

module.exports = new UserController(); // Експорт створеного екземпляра контролера користувачів для використання в інших частинах додатка.
