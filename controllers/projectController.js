const { Project } = require("../models/mysql/associations");

// CREATE PROJECT
const createProject = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Validation
        if (!name || typeof name !== "string" || !name.trim()) {
            const error = new Error("Project name is required");
            error.statusCode = 400;
            throw error;
        }

        // Create project for logged-in user
        const project = await Project.create({
            user_id: req.user.id,
            name: name.trim(),
            description: description || null
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL PROJECTS
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.findAll({
            where: {
                user_id: req.user.id
            },
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            count: projects.length,
            data: projects
        });

    } catch (error) {
        next(error);
    }
};

// GET SINGLE PROJECT
const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await Project.findOne({
            where: {
                id: id,
                user_id: req.user.id
            }
        });

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            data: project
        });

    } catch (error) {
        next(error);
    }
};

// UPDATE PROJECT
const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;

        const project = await Project.findOne({
            where: {
                id: id,
                user_id: req.user.id
            }
        });

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            throw error;
        }

        // Validate name if provided
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                const error = new Error("Project name cannot be empty");
                error.statusCode = 400;
                throw error;
            }

            project.name = name.trim();
        }

        // Validate description if provided
        if (description !== undefined) {
            project.description = description;
        }

        // Validate status if provided
        if (status !== undefined) {
            if (!["active", "completed", "archived"].includes(status)) {
                const error = new Error("Invalid project status");
                error.statusCode = 400;
                throw error;
            }

            project.status = status;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });

    } catch (error) {
        next(error);
    }
};

// DELETE PROJECT
const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await Project.findOne({
            where: {
                id: id,
                user_id: req.user.id
            }
        });

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            throw error;
        }

        await project.destroy();

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject ,getProjects ,getProjectById ,updateProject ,deleteProject
};