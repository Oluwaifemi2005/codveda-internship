const Task = require('../models/Task');

// Get tasks belonging to the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);

    return res.status(500).json({
      message: 'Failed to retrieve tasks',
    });
  }
};

// Create a task for the logged-in user
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Task title is required',
      });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id,
    });

    return res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);

    return res.status(500).json({
      message: 'Failed to create task',
    });
  }
};


const updateTask = async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        title,
        description,
        completed,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);

    return res.status(500).json({
      message: 'Failed to update task',
    });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);

    return res.status(500).json({
      message: 'Failed to delete task',
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};