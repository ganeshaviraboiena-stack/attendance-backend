const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["sick", "casual", "annual", "unpaid"],
      required: true,
    },

    duration: {
      type: String,
      enum: ["full", "half"],
      default: "full",
    },

    halfDaySession: {
      type: String,
      enum: ["morning", "afternoon"],
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: Date,

    rejectionReason: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leave", leaveSchema);