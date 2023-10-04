const fs = require('fs').promises; // Імпорт асинхронних методів файлової системи.
const uuid = require('uuid'); // Імпорт модуля "uuid" для створення унікальних ідентифікаторів.
const path = require('path'); // Імпорт модуля "path" для роботи зі шляхами файлів.
const {Device, DeviceInfo, DeviceImage} = require('../models/models'); // Імпорт моделей "Device" і "DeviceInfo" з файлу "models".
const ApiError = require('../error/ApiError'); // Імпорт класу "ApiError" для обробки помилок.

class DeviceController {
    // Метод "create" призначений для створення нового пристрою.
    async create(req, res, next) {

        try {
            let { name, price, brandId, typeId, info } = req.body;
            const { images } = req.files;

            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const imageUrls = [];

            for (const image of images) {
                const fileName = uuid.v4() + ".jpg";
                image.mv(path.resolve(__dirname, '..', 'static', fileName));
                imageUrls.push(fileName);
            }

            const device = await Device.create({ name, price, brandId, typeId, img: fileName});

            for (const imageUrl of imageUrls) {
                await DeviceImage.create({
                    imageUrl,
                    deviceId: device.id
                });
            }

            if (info) {
                info = JSON.parse(info);
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                );
            }

            return res.json(device);
        } catch (e) {

            next(ApiError.badRequest(e.message));
        }
    }


    // Метод "getAll" призначений для отримання списку всіх пристроїв з можливістю фільтрації за брендом і типом.
    async getAll(req, res) {

        let {brandId, typeId, limit, page} = req.query; // Отримання параметрів фільтрації з запиту.
        page = page || 1; // Встановлення значення сторінки за замовчуванням (1).
        limit = limit || 9; // Встановлення значення ліміту за замовчуванням (9).
        let offset = page * limit - limit; // Визначення зсуву для обмеження кількості результатів на сторінці.
        let devices;

        if (!brandId && !typeId) {
            // Якщо не задані бренд та тип, отримати всі пристрої без фільтрації.
            devices = await Device.findAndCountAll({limit, offset});
        }
        if (brandId && !typeId) {
            // Якщо заданий бренд, але не заданий тип, отримати пристрої з фільтрацією за брендом.
            devices = await Device.findAndCountAll({where:{brandId}, limit, offset});
        }
        if (!brandId && typeId) {
            // Якщо заданий тип, але не заданий бренд, отримати пристрої з фільтрацією за типом.
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset});
        }
        if (brandId && typeId) {
            // Якщо задані бренд і тип, отримати пристрої з фільтрацією за обома параметрами.
            devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset});
        }

        return res.json(devices); // Відповідь сервера у форматі JSON зі списком пристроїв.
    }

    // Метод "getOne" призначений для отримання деталей конкретного пристрою за його ідентифікатором.
    async getOne(req, res) {
        const { id } = req.params; // Отримання ідентифікатора пристрою з параметрів запиту.
        const device = await Device.findOne({
            where: { id },
            include: [
                { model: DeviceInfo, as: 'info' },
                { model: DeviceImage, as: 'deviceImages' } // Один include з обома моделями
            ]
        });
        return res.json(device); // Відповідь сервера у форматі JSON з деталями пристрою.
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            // 1. Знайдіть пристрій у базі даних з пов'язаними із ним фотографіями та інформацією
            const device = await Device.findOne({
                where: { id },
                include: [
                    { model: DeviceImage, as: 'deviceImages' },
                    { model: DeviceInfo, as: 'info' }
                ]
            });

            if (!device) {
                return next(ApiError.notFound(`Device with ID ${id} not found.`));
            }

            // 2. Отримайте список URL фотографій пристрою
            const imageUrls = device.deviceImages.map(img => img.imageUrl);

            // 3. Видаліть фотографії з файлової системи
            const deleteImagePromises = imageUrls.map(async imageUrl => {
                const imagePath = path.resolve(__dirname, '..', 'static', imageUrl);
                try {
                    await fs.access(imagePath);
                    await fs.unlink(imagePath);
                } catch (error) {
                    console.log(`Image ${imageUrl} not found on file system.`);
                }
            });

            // Очікуємо завершення усіх операцій видалення
            await Promise.all(deleteImagePromises);

            // 4. Видалення пристрою, його фотографій та інформації з бази даних
            await DeviceImage.destroy({ where: { deviceId: id } });
            await DeviceInfo.destroy({ where: { deviceId: id } });
            await device.destroy();

            // Відповідь сервера з підтвердженням видалення
            return res.json({ message: 'Device, its images and info deleted successfully' });
        } catch (e) {
            next(ApiError.internalServerError(e.message));
        }
    }

}

module.exports = new DeviceController(); // Експорт створеного екземпляра контролера пристроїв для використання в інших частинах додатка.
