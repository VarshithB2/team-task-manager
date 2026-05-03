const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/task.controller');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', ctrl.getTasks);
router.get('/:id', ctrl.getTaskById);

router.post(
  '/',
  adminOnly,
  [
    body('title').notEmpty().withMessage('Title required'),
    body('project').notEmpty().withMessage('Project required'),
    body('assignedTo').notEmpty().withMessage('Assignee required'),
    body('dueDate').notEmpty().withMessage('Due date required'),
  ],
  ctrl.createTask
);

router.put('/:id', ctrl.updateTask); // admin: any field, member: status only (enforced in controller)
router.delete('/:id', adminOnly, ctrl.deleteTask);

module.exports = router;
