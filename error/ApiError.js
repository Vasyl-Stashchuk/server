class ApiError extends Error {
    constructor(status, message) {
        super(); // Виклик конструктора батьківського класу "Error".
        this.status = status; // HTTP-статус помилки (наприклад, 404, 500, 403).
        this.message = message; // Повідомлення про помилку.
    }

    // Статичний метод "badRequest" створює новий екземпляр класу "ApiError" з HTTP-статусом 404 (Not Found).
    static badRequest(message) {
        return new ApiError(404, message);
    }

    // Статичний метод "internal" створює новий екземпляр класу "ApiError" з HTTP-статусом 500 (Internal Server Error).
    static internal(message) {
        return new ApiError(500, message);
    }

    // Статичний метод "forbidden" створює новий екземпляр класу "ApiError" з HTTP-статусом 403 (Forbidden).
    static forbidden(message) {
        return new ApiError(403, message);
    }
}

module.exports = ApiError; // Експорт класу "ApiError" для використання в інших частинах додатка.
