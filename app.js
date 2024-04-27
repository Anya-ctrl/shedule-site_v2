import { join, dirname } from 'path';
import express from 'express';
import { urlencoded, json } from 'express';
import { fileURLToPath } from 'url';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import indexController from './controllers/indexController.js';
import sequelize from './config/connect.js';
import configEnv from "./config/db.config.js"
import indexRouter from './routes/indexRouter.js';
import models from './models/index.js';
import { error } from 'console';

// Константи та конфігурації
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Експрес-ініціалізація програми
const app = express();

// Middleware setup
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(json());

// Проверка соединения с базой данных
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Синхронизация моделей с базой данных
sequelize.sync()
    .then(() => {
        console.log('All models were synchronized successfully.');
    })
    .catch((err) => {
        console.error('Unable to synchronize models:', err);
    });

// Настройка приложения Express
app.use(express.static(join(__dirname, "public")));
app.set('view engine', 'ejs');

app.use(passport.initialize());

app.use('/', indexRouter);

// Завершение работы сервера при выключении
process.on('SIGINT', () => {
    sequelize.close()
        .then(() => {
            console.log('Database connection closed.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Error closing database connection:', err);
            process.exit(1);
        });
});

// Обработка ошибки 404 - не найдено
app.use(indexController.checkAuth, (req, res, next) => {
    let user = indexController.getUserFromToken(req.cookies.token);

    const error = {
        message: 'Страница не найдена'
    };
    res.status(404).render('404', { error, user });
});

// Обработка ошибки 500 и других внутренних ошибок
app.use(indexController.checkAuth, (err, req, res, next) => {
    console.error(err.stack);

    let user = indexController.getUserFromToken(req.cookies.token);

    const error = {
        message: 'Что-то пошло не так на сервере' 
    };

    res.status(err.status || 500).render('404', { error, user });
});


// Запуск сервера на указанном порту
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced');
        app.listen(configEnv.PORT, () => {
            console.log(`Server is running on port ${configEnv.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to sync database:', error);
    });