const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    jobTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "job_title",
    },

    department: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    teamSize: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "team_size",
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },

    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    underscored: true,
  },
);

module.exports = User;
