const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    checkIn: {
      time: {
        type: String,
      },

      timestamp: {
        type: Date,
      },

      location: {
        type: {
          type: String,
          enum: ["WFO", "WFH"],
        },

        lat: Number,

        lng: Number,

        ip: String,
      },
    },

    checkOut: {
      time: {
        type: String,
      },

      timestamp: {
        type: Date,
      },

      location: {
        lat: Number,

        lng: Number,
      },
    },

    breaks: [
      {
        start: String,

        end: String,

        duration: Number,
      },
    ],

    summary: {
      totalHours: {
        type: Number,
        default: 0,
      },

      regularHours: {
        type: Number,
        default: 0,
      },

      overtime: {
        type: Number,
        default: 0,
      },

      lateBy: {
        type: Number,
        default: 0,
      },

      earlyExitBy: {
        type: Number,
        default: 0,
      },

      status: {
        type: String,
        enum: [
          "present",
          "absent",
          "half-day",
          "leave",
          "short-day",
        ],
        default: "present",
      },
    },

    leaveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);