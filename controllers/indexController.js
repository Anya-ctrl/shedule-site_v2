import models from '../models/index.js';
import userService from '../services/userService.js';
import { validationResult } from 'express-validator';
import Jwt from 'jsonwebtoken';
import configEnv from "../config/db.config.js"
import bcrypt from 'bcryptjs';

async function getIndexPage(req, res) {
    console.log('Processing request for index page');

    try {
        const [faculty, speciality, course, group] = await Promise.all([
            models.Faculty.findAll(),
            models.Speciality.findAll(),
            models.Course.findAll(),
            models.Group.findAll()
        ]);

        let user = {};
        user.groupId = false;
        if (res.locals.auth) {
            const token = req.cookies.token;
            const { email, groupId } = Jwt.decode(token);
            user.groupId = groupId;
            user.email = email;
            const USER = await models.User.findOne({
                where: {
                    email
                }
            })
            const { role } = USER.dataValues;
            user.role = role;
        }
        
        if (!Object.keys(user).length) {
            user = false;
        }
        
        res.render('index', {
            faculty,
            speciality,
            course,
            group,
            auth: res.locals.auth,
            user
         });           
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }

    console.log('Index page request processed and rendered');
}

async function updateRole(req, res) {
    const { userId, newRole } = req.body;
    console.log(userId, newRole)
    try {
        await models.User.update({ role: newRole }, { where: { id: userId } });

        // Обновление токена в cookies
        const token = req.cookies.token;
        if (token) {
            let user = getUserFromToken(token);
            user.role = newRole;
            res.cookie('token', token);
        }

        res.redirect('/admin');
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send('Error updating user role');
    }
}

async function getAdminPage(req, res) {
    console.log('Processing request for admin page');

    if (!res.locals.auth) { return res.redirect('/'); }

    try {
        let form = {};
        let user = getUserFromToken(req.cookies.token);
         
        if (user && user.role === 'admin') {
            const users = await models.User.findAll({
                attributes: ['id', 'name', 'surname', 'email', 'role']
            });

            const students = await models.Student.findAll();
            const groups = await models.Group.findAll();
            const professors = await models.Professor.findAll();    
            const monday = await models.Monday.findAll();
            const tuesday = await models.Tuesday.findAll();
            const wednesday = await models.Wednesday.findAll();
            const thursday = await models.Thursday.findAll();
            const friday = await models.Friday.findAll();
        
            res.render('admin', {
                form,
                auth: res.locals.auth,
                user,
                users,
                students,
                groups,
                professors,
                errors: res.locals.errors,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }

    console.log('Admin page request processed and rendered');
}

async function compareUserwithStudent(req, res, next) {
    res.locals.user = {};

    const userEmail = req.body.email;
    const student = await models.Student.findOne({
        where: {
            email: userEmail
        }
    });

    if (!student) {
        res.locals.user.isStudent = false;
        res.locals.user.groupId = false;
        next();
        return;
    }

    const { group_id: groupId } =  student.dataValues;

    res.locals.user.isStudent = true;
    res.locals.user.groupId = groupId;

    next();
}

function getUserFromToken(token) {
    let user = {};
    user.groupId = false;
    if (token) {
        const { groupId, email, role } = Jwt.decode(token);
        user.groupId = groupId;
        user.email = email;
        user.role = role;
    }
    return user;
}

async function getEntryPage(req, res) {
    console.log('Processing request for entry page');

    let user = getUserFromToken(req.cookies.token);
    
    if (!Object.keys(user).length) {
        user = false;
    }

    let form = {
        email: req.body.email
    };

    res.render('entry', { 
        errors: [],
        form: form,
        user
    });

    console.log('Entry page request processed and rendered');
}

async function getProfessorsPage(req, res) {
    console.log('Processing request for professors page');

    if (!res.locals.auth) { return res.redirect('/entry'); }

    const professors = await models.Professor.findAll();

    let user = getUserFromToken(req.cookies.token);

    res.render('professors', {
        professors,
        user
    });

    console.log('Professors page request processed and rendered');
}

async function getRegistrationPage(req, res) {
    console.log('Processing request for registration page');

    let form = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email
    };

    let user = getUserFromToken(req.cookies.token);

    res.render('registration', { 
        errors: [],
        form: form,
        auth: res.locals.auth,
        user
    });

    console.log('Registration page request processed and rendered');
}

function getSchedulePage(req, res, next) {
    console.log('Processing request for schedule page');

    if (!res.locals.auth) { return res.redirect('/entry'); }

    res.locals.user = {};
    const token = req.cookies.token;
    const { groupId, email, role } = Jwt.decode(token);
    res.locals.user.groupId = groupId;
    res.locals.user.email = email;
    res.locals.user.role = role;   

    console.log('Schedule page request processed and rendered');
    next();
}

async function handleRegister(req, res) {
    let form = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email
    };

    let validationError = validationResult(req);
    if(!validationError.isEmpty()) {
        validationError.array().forEach((error) => {
            res.locals.errors.push(error.msg);
        });

        res.render('registration', { 
            errors: res.locals.errors,
            form: form
        });
    };

    try {
        let user = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        };

        let userRole = 'guest';

        const { isStudent, groupId } = res.locals.user;

        if (isStudent) {
            userRole = 'student';
        };

        try {
            const USER = await userService.createNewUser({...user, role: userRole});

            const {id, email, role} = USER.dataValues;

            const token = generateJWT({
                id, 
                email, 
                role,
                groupId
            });

            res.cookie('token', token, { 
                httpOnly: true,
                maxAge: (24 * 60 * 60 *1000)
            });

            res.redirect("/");
        } catch (error) {
            res.locals.errors.push(error.message);
        
            console.log(res.locals.errors);
        
            res.render('registration', { 
                errors: res.locals.errors,
                form: form
            });
        }
        
    } catch (error) {
        res.render('registration', { 
            errors: res.locals.errors,
            form: form
        });
    };
};

async function handleLogin(req, res) {

    try {
        let form = {
            email: req.body.email
        };

        let user = {
            email: req.body.email,
            password: req.body.password
        };

        let validationError = validationResult(req);
        if(!validationError.isEmpty()) {
                validationError.array().forEach((error) => {
                res.locals.errors.push(error.msg);
            });

            return res.render('entry', { 
                errors: res.locals.errors,
                form: form
            });
        };

        const USER = await models.User.findOne({
            where: {
                email: user.email
            }
        });

        if (!USER) {
            res.locals.errors.push('User not found!');

            return res.render('entry', { 
                errors: res.locals.errors,
                form: form
            });
        }

        const checkPassword = await bcrypt.compare(user.password, USER.password);

        if (!checkPassword) {
            res.locals.errors.push('Invalid password.');

            return res.render('entry', {
                errors: res.locals.errors,
                form: form
            });
        }

        const {id, email, role} = USER.dataValues;
        const { groupId } = res.locals.user;
        
        const token = generateJWT({
            id, 
            email, 
            role,
            groupId
        });

        res.cookie('token', token, { 
            httpOnly: true,
            maxAge: (24 * 60 * 60 *1000)
        });

        res.redirect("/");
    } catch (error) {
        res.render('entry', { 
            errors: res.locals.errors,
            form: form
        });
    }
}

function handleLogout(req, res, next) {
    if (req.cookies.token) return res.clearCookie('token').redirect('/');
    next();
}

async function handleAddStudent(req, res) {
    const { name, surname, email, group_id } = req.body;

    let user = getUserFromToken(req.cookies.token);

    try {
        let form = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
        };

        let validationError = validationResult(req);
        if(!validationError.isEmpty()) {
            validationError.array().forEach((error) => {
                res.locals.errors.push(error.msg);
            });

            const users = await models.User.findAll({
                attributes: ['id', 'name', 'surname', 'email', 'role']
            });

            const students = await models.Student.findAll();
            const groups = await models.Group.findAll();
            const professors = await models.Professor.findAll();    
        
            return res.render('admin', {
                form,
                auth: res.locals.auth,
                user,
                users,
                students,
                groups,
                professors,
                errors: res.locals.errors
            });
        };

        await models.Student.create({ name, surname, email, group_id });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding student:', error);
    }
}

async function handleAddProfessor(req, res) {
    const { fullName, phone, link } = req.body;

    let user = getUserFromToken(req.cookies.token);

    try {
        let form = {
            fullName: req.body.fullName,
            phone: req.body.phone,
            link: req.body.link,
        };

        let validationError = validationResult(req);
        if(!validationError.isEmpty()) {
            validationError.array().forEach((error) => {
                res.locals.errors.push(error.msg);
            });

            const users = await models.User.findAll({
                attributes: ['id', 'name', 'surname', 'email', 'role']
            });

            const students = await models.Student.findAll();
            const groups = await models.Group.findAll();
            const professors = await models.Professor.findAll();    
        
            return res.render('admin', {
                form,
                auth: res.locals.auth,
                user,
                users,
                students,
                groups,
                professors,
                errors: res.locals.errors
            });
        };

        await models.Professor.create({ fullName, phone, link });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding student:', error);
    }
}

function generateJWT(payload){
    return Jwt.sign(payload, configEnv.SECRET, {
        expiresIn: '1d',
    })
};

function checkAuth(req, res, next){
    const token = req.cookies.token;

    if (!token) {
        res.locals.auth = false;
        next();
        return;
    } 

    const isValidToken = Jwt.verify(token, configEnv.SECRET);

    if (!isValidToken) {
        res.locals.auth = false;
        next();
        return;
    }

    res.locals.auth = true;
    next();
};

export default {
    getIndexPage,
    getEntryPage,
    updateRole,
    getAdminPage,
    getProfessorsPage,
    getRegistrationPage,
    getSchedulePage,
    handleRegister,
    handleLogin,
    handleLogout,
    checkAuth,
    compareUserwithStudent,
    getUserFromToken,
    handleAddStudent,
    handleAddProfessor
};