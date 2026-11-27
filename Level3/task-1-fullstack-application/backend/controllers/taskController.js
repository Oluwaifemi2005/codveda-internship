
const mongoose = require('mongoose');
const Task = require('../models/Task');
const cache = require('../utils/cache');


const getTasks = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const skip = (page - 1) * limit;
    const userFilter = { user: req.user.id };

    const [tasks, total, completed] = await Promise.all([
      Task.find(userFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Task.countDocuments(userFilter),

      Task.countDocuments({
        ...userFilter,
        completed: true,
      }),
    ]);

    return res.status(200).json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        completed,
        pending: total - completed,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve tasks.',
    });
  }
};


const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: 'Task title is required.',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      user: req.user.id,
    });
    cache.del('admin:dashboard');

    return res.status(201).json({
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create task.',
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid task ID.',
      });
    }

    const { title, description, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          message: 'Title cannot be empty.',
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({
          message: 'Description must be a string.',
        });
      }

      updates.description = description;
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({
          message: 'Completed must be a boolean.',
        });
      }

      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'Provide at least one field to update.',
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }
    cache.del('admin:dashboard');

    return res.status(200).json({
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update task.',
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid task ID.',
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }
    cache.del('admin:dashboard');

    return res.status(200).json({
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete task.',
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
