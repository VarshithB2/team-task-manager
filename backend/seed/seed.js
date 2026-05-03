require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

(async () => {
  try {
    await connectDB();
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
    ]);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'Admin@123',
      role: 'admin',
    });
    const member = await User.create({
      name: 'Member User',
      email: 'member@test.com',
      password: 'Member@123',
      role: 'member',
    });

    const project = await Project.create({
      title: 'Website Revamp',
      description: 'Redesign and ship the new marketing site.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      members: [admin._id, member._id],
      createdBy: admin._id,
    });

    await Task.insertMany([
      {
        title: 'Design landing page',
        description: 'New hero + features section',
        project: project._id,
        assignedTo: member._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
      {
        title: 'Set up analytics',
        project: project._id,
        assignedTo: member._id,
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // overdue
        createdBy: admin._id,
      },
      {
        title: 'Write copy',
        project: project._id,
        assignedTo: admin._id,
        status: 'Completed',
        priority: 'Low',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
      },
    ]);

    console.log('✅ Seed complete.');
    console.log('Admin:  admin@test.com  / Admin@123');
    console.log('Member: member@test.com / Member@123');
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
