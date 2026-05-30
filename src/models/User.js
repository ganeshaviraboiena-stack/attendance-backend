const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["manager", "admin", "employee"],
      default: "employee",
    },

    department: {
      type: String,
      default: "",
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    profilePic: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    leaveBalance: {
      sick: {
        type: Number,
        default: 12,
      },

      casual: {
        type: Number,
        default: 12,
      },

      annual: {
        type: Number,
        default: 18,
      },

      unpaid: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);