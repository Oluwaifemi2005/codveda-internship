const User = require('../models/User');
const Task = require('../models/Task');
const cache = require('../utils/cache');

const getDashboard = async (req, res) => {
  try {
    const cacheKey = 'admin:dashboard';
    const cachedStats = cache.get(cacheKey);

    if (cachedStats) {
      return res.status(200).json({
        ...cachedStats,
        cached: true,
      });
    }

    const [totalUsers, totalTasks, completedTasks] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ completed: true }),
    ]);

    const stats = {
      success: true,
      stats: {
        totalUsers,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
      },
    };

    cache.set(cacheKey, stats);

    return res.status(200).json({
      ...stats,
      cached: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to load admin dashboard.',
    });
  }
};

module.exports = { getDashboard };