const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");

const Project = sequelize.define("Project", {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("active", "completed", "archived"),
        defaultValue: "active"
    }
}, {
    tableName: "projects",
    timestamps: true,
    underscored: true
});

module.exports = Project;