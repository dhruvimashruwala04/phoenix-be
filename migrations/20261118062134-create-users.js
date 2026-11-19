"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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

      job_title: {
        type: DataTypes.STRING(100),
        field: "job_title",
        allowNull: true,
      },

      department: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      team_size: {
        type: DataTypes.STRING(20),
        field: "team_size",
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    await queryInterface.addIndex("users", ["email"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};
