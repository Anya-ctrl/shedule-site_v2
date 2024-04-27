import { Router } from 'express';
import { validationResult } from 'express-validator';
const router = Router();

import indexController from '../controllers/indexController.js';
import auth from "../validation/authValidation.js";

import Faculty from '../models/faculty.js';
import Speciality from '../models/speciality.js';
import Course from '../models/course.js';
import Group from '../models/group.js';

import Monday from '../models/monday.js';
import Tuesday from '../models/tuesday.js';
import Wednesday from '../models/wednesday.js';
import Thursday from '../models/thursday.js';
import Friday from '../models/friday.js';
import models from '../models/index.js';


// Логирование для каждого маршрута
router.get('/', indexController.checkAuth, (req, res, next) => {
    console.log('Получен запрос на главную страницу');
    indexController.getIndexPage(req, res, next);
});

router.get('/entry', indexController.checkAuth, (req, res, next) => {
    console.log('Получен запрос на страницу входа');
    indexController.getEntryPage(req, res, next);
});

router.get('/admin', indexController.checkAuth, (req, res) => {
    console.log('Получен запрос на страницу администратора');
    indexController.getAdminPage(req, res);
});

router.post('/admin/update-role',indexController.checkAuth, (req, res) => {
    console.log('Получен запрос на изменение роли пользователя');
    indexController.updateRole(req, res);
});

router.post('/admin/delete-student', indexController.checkAuth, async (req, res) => {
    const studentId = req.body.studentId;
    try {
        await models.Student.destroy({ where: { student_id: studentId } });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
    }
});

router.post('/admin/add-student', indexController.checkAuth, auth.validadateAddStudent, async (req, res) => {
    indexController.handleAddStudent(req, res);
});

router.post('/admin/delete-professor', indexController.checkAuth, async (req, res) => {
    const professorId = req.body.professorId;
    try {
        await models.Professor.destroy({ where: { professor_id: professorId } });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
    }
});

router.post('/admin/add-professor', indexController.checkAuth, auth.validadateAddProfessor, async (req, res) => {
    indexController.handleAddProfessor(req, res);
});
  
router.post('/admin/edit-shedule', async (req, res) => {
    try {
        const { 
            groupId, 
            mondayFirstLesson,
            mondaySecondLesson,
            mondayThirdLesson,
            mondayFourthLesson,
            tuesdayFirstLesson,
            tuesdaySecondLesson,
            tuesdayThirdLesson,
            tuesdayFourthLesson,
            wednesdayFirstLesson,
            wednesdaySecondLesson,
            wednesdayThirdLesson,
            wednesdayFourthLesson,
            thursdayFirstLesson,
            thursdaySecondLesson,
            thursdayThirdLesson,
            thursdayFourthLesson,
            fridayFirstLesson,
            fridaySecondLesson,
            fridayThirdLesson,
            fridayFourthLesson
        } = req.body;
    
        let monday = await models.Monday.findOne({ where: { group_id: groupId } });
        if (!monday) {
            monday = await models.Monday.create({ group_id: groupId });
        }

        monday.firstLesson = mondayFirstLesson;
        monday.secondLesson = mondaySecondLesson;
        monday.thirdLesson = mondayThirdLesson;
        monday.fourthLesson = mondayFourthLesson;

        await monday.save();

        let tuesday = await models.Tuesday.findOne({ where: { group_id: groupId } });
        if (!tuesday) {
            tuesday = await models.Tuesday.create({ group_id: groupId });
        }

        tuesday.firstLesson = tuesdayFirstLesson;
        tuesday.secondLesson = tuesdaySecondLesson;
        tuesday.thirdLesson = tuesdayThirdLesson;
        tuesday.fourthLesson = tuesdayFourthLesson;

        await tuesday.save();

        let wednesday = await models.Wednesday.findOne({ where: { group_id: groupId } });
        if (!wednesday) {
            wednesday = await models.Wednesday.create({ group_id: groupId });
        }

        wednesday.firstLesson = wednesdayFirstLesson;
        wednesday.secondLesson = wednesdaySecondLesson;
        wednesday.thirdLesson = wednesdayThirdLesson;
        wednesday.fourthLesson = wednesdayFourthLesson;

        await wednesday.save();

        let thursday = await models.Thursday.findOne({ where: { group_id: groupId } });
        if (!thursday) {
            thursday = await models.Thursday.create({ group_id: groupId });
        }

        thursday.firstLesson = thursdayFirstLesson;
        thursday.secondLesson = thursdaySecondLesson;
        thursday.thirdLesson = thursdayThirdLesson;
        thursday.fourthLesson = thursdayFourthLesson;

        await thursday.save();

        let friday = await models.Friday.findOne({ where: { group_id: groupId } });
        if (!friday) {
            friday = await models.Friday.create({ group_id: groupId });
        }

        friday.firstLesson = fridayFirstLesson;
        friday.secondLesson = fridaySecondLesson;
        friday.thirdLesson = fridayThirdLesson;
        friday.fourthLesson = fridayFourthLesson;

        await friday.save();
    
        res.redirect('/admin');
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).send('Error updating schedule');
    }
});

router.get('/professors', indexController.checkAuth, (req, res, next) => {
    console.log('Получен запрос на страницу с преподавателями');
    indexController.getProfessorsPage(req, res, next);
});

router.get('/registration', indexController.checkAuth, (req, res, next) => {
    console.log('Получен запрос на страницу регистрации');
    indexController.getRegistrationPage(req, res, next);
});

router.post('/register', indexController.checkAuth, indexController.compareUserwithStudent, auth.validateRegister,(req, res) => {
    console.log('Получен запрос на регистрацию');
    indexController.handleRegister(req, res);
});

router.post('/login', indexController.checkAuth, indexController.compareUserwithStudent, auth.validateLogin, (req, res) => {
    console.log('Получен запрос на логин');
    indexController.handleLogin(req, res);
});

router.get('/logout', indexController.checkAuth, (req, res, next) => {
    console.log('Получен запрос на выход');
    indexController.handleLogout(req, res, next);
});

/*****************/

router.get('/faculties', indexController.checkAuth, async (req, res) => {
    try {
      const faculties = await Faculty.findAll();
      res.json(faculties);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching faculties' });
    }
});

router.get('/specialities/:faculty_id', indexController.checkAuth, async (req, res) => {
    const { faculty_id } = req.params;

    try {
        if (!faculty_id) {
            return res.status(400).json({ error: 'Invalid faculty ID' });
        }

        const specialities = await Speciality.findAll({ where: { faculty_id } });

        if (!Array.isArray(specialities)) {
            return res.status(500).json({ error: 'Error fetching specialities' });
        }

        res.json(specialities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching specialities' });
    }
});

router.get('/courses', indexController.checkAuth, async (req, res) => {
    try {
      const courses = await Course.findAll();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching courses' });
    }
});

router.get('/groups/:specialityId/:courseId', indexController.checkAuth, async (req, res) => {
    const { specialityId, courseId } = req.params;
    try {
        const groups = await Group.findAll({ where: { speciality_id: specialityId, course_id: courseId } });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching groups' });
    }
});

/**************/

router.get('/shedule/:groupId', indexController.checkAuth, indexController.getSchedulePage, async (req, res) => {
    const { groupId } = req.params;
    try {
        const monday = await Monday.findOne({ where: { group_id: groupId } });
        const tuesday = await Tuesday.findOne({ where: { group_id: groupId } });
        const wednesday = await Wednesday.findOne({ where: { group_id: groupId } });
        const thursday = await Thursday.findOne({ where: { group_id: groupId } });
        const friday = await Friday.findOne({ where: { group_id: groupId } });
        const selectedGroup = groupId;

        res.render("shedule", { 
            monday, 
            tuesday,
            wednesday,
            thursday,
            friday,
            selectedGroup 
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching groups' });
    }
});

export default router;
