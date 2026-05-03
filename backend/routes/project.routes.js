const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/project.controller');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', ctrl.getProjects);
router.get('/:id', ctrl.getProjectById);

router.post(
  '/',
  adminOnly,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('deadline').notEmpty().withMessage('Deadline is required'),
  ],
  ctrl.createProject
);
router.put('/:id', adminOnly, ctrl.updateProject);
router.delete('/:id', adminOnly, ctrl.deleteProject);

module.exports = router;
