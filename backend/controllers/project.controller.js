const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');

exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, deadline, members } = req.body;
  const project = await Project.create({
    title,
    description,
    deadline,
    members: members || [],
    createdBy: req.user._id,
  });
  res.status(201).json(project);
};

exports.getProjects = async (req, res) => {
  const filter =
    req.user.role === 'admin' ? {} : { members: req.user._id };
  const projects = await Project.find(filter)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(projects);
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email');
  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (
    req.user.role !== 'admin' &&
    !project.members.some((m) => m._id.equals(req.user._id))
  ) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const tasks = await Task.find({ project: project._id })
    .populate('assignedTo', 'name email')
    .sort({ dueDate: 1 });

  res.json({ project, tasks });
};

exports.updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const fields = ['title', 'description', 'deadline', 'members'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) project[f] = req.body[f];
  });
  await project.save();
  res.json(project);
};

exports.deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: 'Project deleted' });
};
