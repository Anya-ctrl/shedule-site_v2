import { body } from "express-validator";


let validateRegister = [
    function(req, res, next) {  
        res.locals.errors = [];
        next();
    },
    body('email', 'Введіть корректний email').isEmail().trim(),
    body('password', 'Введіть корректний пароль. Пароль повинен бути як мінімум 6 символів').isLength({min: 6}),
    body('passwordConfirm', "Паролі не співпадають").custom((value, {req}) => {
        return value === req.body.password
    })
];

let validateLogin = [
    function(req, res, next) {  
        res.locals.errors = [];
        next();
    },
    body('email', 'Введіть корректний email').isEmail().trim(),
    body('password', 'Введіть корректний пароль. Пароль повинен бути як мінімум 6 символів').isLength({min: 6})
];

let validadateAddStudent = [
    function(req, res, next) {  
        res.locals.errors = [];
        next();
    },
    body('email', 'Введіть корректний email').isEmail().trim()
];

let validadateAddProfessor = [
    function(req, res, next) {  
        res.locals.errors = [];
        next();
    },
    body('phone').notEmpty().withMessage('Введите номер телефона').matches(/^(?:\+380|380|0)\d{9}$/).withMessage('Введите корректный номер телефона'),
];

export default {
    validateRegister,
    validateLogin,
    validadateAddStudent,
    validadateAddProfessor
}