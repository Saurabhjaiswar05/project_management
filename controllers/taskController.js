const Task = require("../models/mongodb/Task");
const { Project } = require("../models/mysql/associations");
const mongoose = require("mongoose");

// CREATE TASK
const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            projectId,
            status,
            priority
        } = req.body;

        // Validation
        if (!title || typeof title !== "string" || !title.trim()) {
            const error = new Error("Task title is required");
            error.statusCode = 400;
            throw error;
        }

        if (!projectId || !Number.isInteger(Number(projectId))) {
            const error = new Error("Valid projectId is required");
            error.statusCode = 400;
            throw error;
        }

        // Check whether project exists and belongs to logged-in user
        const project = await Project.findOne({
            where: {
                id: projectId,
                user_id: req.user.id
            }
        });

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            throw error;
        }

        // Create task in MongoDB
        const task = await Task.create({
            title: title.trim(),
            description: description || "",
            projectId: Number(projectId),
            userId: Number(req.user.id),
            status: status || "todo",
            priority: priority || "medium"
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL TASKS
const getTasks = async (req, res, next) => {
    try {
        const {
            projectId,
            status,
            priority,
            page = 1,
            limit = 10
        } = req.query;

        

        const filter = {
            userId: Number(req.user.id)
        };

        if (projectId) {
            filter.projectId = Number(projectId);
        }

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalTasks = await Task.countDocuments(filter);

        return res.status(200).json({
            success: true,
            currentPage: Number(page),
            totalPages: Math.ceil(totalTasks / Number(limit)),
            totalTasks,
            data: tasks
        });

    } catch (error) {
        next(error);
    }
};


// GET SINGLE TASK
const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid task ID");
    error.statusCode = 400;
    throw error;
}
        const task = await Task.findOne({
            _id: id,
            userId: Number(req.user.id)
        });

        if (!task) {
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            data: task
        });

    } catch (error) {
        next(error);
    }
};

// UPDATE TASK
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid task ID");
    error.statusCode = 400;
    throw error;
}

        const task = await Task.findOne({
            _id: id,
            userId: Number(req.user.id)
        });

        if (!task) {
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                const error = new Error("Title cannot be empty");
                error.statusCode = 400;
                throw error;
            }

            task.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string") {
                const error = new Error("Description must be a string");
                error.statusCode = 400;
                throw error;
            }

            task.description = description;
        }

        if (status !== undefined) {
            if (!["todo", "in_progress", "completed"].includes(status)) {
                const error = new Error("Invalid task status");
                error.statusCode = 400;
                throw error;
            }

            task.status = status;
        }

        if (priority !== undefined) {
            if (!["low", "medium", "high"].includes(priority)) {
                const error = new Error("Invalid task priority");
                error.statusCode = 400;
                throw error;
            }

            task.priority = priority;
        }

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });

    } catch (error) {
        next(error);
    }
};

// DELETE TASK
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid task ID");
    error.statusCode = 400;
    throw error;
}
        const task = await Task.findOne({
            _id: id,
            userId: Number(req.user.id)
        });

        if (!task) {
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        await task.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createTask , getTasks ,getTaskById ,updateTask,deleteTask
};