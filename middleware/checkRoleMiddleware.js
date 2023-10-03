const jwt = require('jsonwebtoken')

// Повертаємо middleware функцію, яка отримує роль (role) як параметр.
module.exports = function (role) {
    return function (req, res, next) {
        // Перевіряємо, чи це запит OPTIONS (це може бути запит на передпереговори при CORS).
        if (req.method === "OPTIONS") {
            next(); // Пропускаємо обробку і переходимо до наступного middleware (якщо він є).
        }
        try {
            // Отримуємо токен з заголовку авторизації, розділяючи його за пробілом і обираючи другий елемент (Bearer token).
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({message: "Не авторизований"}); // Повертаємо помилку, якщо токен відсутній.
            }
            // Верифікуємо та розшифровуємо токен за допомогою секретного ключа (SECRET_KEY) і отримуємо розшифровані дані.
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            // Перевіряємо, чи роль користувача співпадає з вимаганою роллю.
            if (decoded.role !== role) {
                return res.status(403).json({message: "Немає доступу"}); // Повертаємо помилку доступу, якщо роль не співпадає.
            }
            req.user = decoded; // Додаємо розшифровані дані до об'єкту req для подальшого використання.
            next(); // Продовжуємо обробку запиту.
        } catch (e) {
            res.status(401).json({message: "Не авторизований"}); // Обробка помилки, якщо токен недійсний або сталася інша помилка.
        }
    };
}
