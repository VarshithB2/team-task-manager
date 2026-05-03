const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getStats = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const projectFilter = isAdmin ? {} : { members: req.user._id };
  const taskFilter = isAdmin ? {} : { assignedTo: req.user._id };

  const [totalProjects, totalTasks, pending, inProgress, completed, overdue] =
    await Promise.all([
      Project.countDocuments(projectFilter),
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'Pending' }),
      Task.countDocuments({ ...taskFilter, status: 'In Progress' }),
      Task.countDocuments({ ...taskFilter, status: 'Completed' }),
      Task.countDocuments({
        ...taskFilter,
        status: { $ne: 'Completed' },
        dueDate: { $lt: new Date() },
      }),
    ]);

  res.json({
    totalProjects,
    totalTasks,
    pending,
    inProgress,
    completed,
    overdue,
  });
};
