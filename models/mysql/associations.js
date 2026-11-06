const User = require("./User");
const Project = require("./Project");

User.hasMany(Project, {
    foreignKey: "user_id",
    as: "projects"
});

Project.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

module.exports = { User, Project };