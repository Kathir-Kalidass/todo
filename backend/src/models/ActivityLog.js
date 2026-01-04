import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    taskTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    listId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    taskId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "activity_logs"
  }
);

export default ActivityLog;
