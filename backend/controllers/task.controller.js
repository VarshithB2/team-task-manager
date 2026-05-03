const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, project, assignedTo, status, priority, dueDate } =
    req.body;

  const projectDoc = await Project.findById(project);
  if (!projectDoc) return res.status(404).json({ message: 'Project not found' });

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo,
    status: status || 'Pending',
    priority: priority || 'Medium',
    dueDate,
    createdBy: req.user._id,
  });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const filter =
    req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('project', 'title')
    .sort({ dueDate: 1 });
  res.json(tasks);
};

exports.getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('project', 'title')
    .populate('createdBy', 'name email');
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (
    req.user.role !== 'admin' &&
    !task.assignedTo._id.equals(req.user._id)
  ) {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const isAdmin = req.user.role === 'admin';
  const isAssignee = task.assignedTo.equals(req.user._id);

  if (!isAdmin && !isAssignee) {
    return res.status(403).json({ message: 'Access denied' });
  }

  if (isAdmin) {
    const fields = [
      'title',
      'description',
      'project',
      'assignedTo',
      'status',
      'priority',
      'dueDate',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });
  } else {
    // Members can only update status of their own tasks
    if (req.body.status !== undefined) task.status = req.body.status;
  }

  await task.save();
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await task.deleteOne();
  res.json({ message: 'Task deleted' });
};
