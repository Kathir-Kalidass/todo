import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    msUserId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    msEmail: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "users"
  }
);

export default User;
