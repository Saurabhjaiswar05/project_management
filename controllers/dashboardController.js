const { Project } = require("../models/mysql/associations");
const Task = require("../models/mongodb/Task");

// GET DASHBOARD STATISTICS
const getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // MySQL project statistics
        const [
            totalProjects,
            activeProjects,
            completedProjects,
            archivedProjects
        ] = await Promise.all([
            Project.count({ where: { user_id: userId } }),
            Project.count({ where: { user_id: userId, status: "active" } }),
            Project.count({ where: { user_id: userId, status: "completed" } }),
            Project.count({ where: { user_id: userId, status: "archived" } })
        ]);

        // MongoDB task statistics
        const [
            totalTasks,
            todoTasks,
            inProgressTasks,
            completedTasks,
            highPriorityTasks
        ] = await Promise.all([
            Task.countDocuments({ userId: Number(userId) }),
            Task.countDocuments({ userId: Number(userId), status: "todo" }),
            Task.countDocuments({ userId: Number(userId), status: "in_progress" }),
            Task.countDocuments({ userId: Number(userId), status: "completed" }),
            Task.countDocuments({ userId: Number(userId), priority: "high" })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                projects: {
                    total: totalProjects,
                    active: activeProjects,
                    completed: completedProjects,
                    archived: archivedProjects
                },
                tasks: {
                    total: totalTasks,
                    todo: todoTasks,
                    inProgress: inProgressTasks,
                    completed: completedTasks,
                    highPriority: highPriorityTasks
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};