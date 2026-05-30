const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const moment = require("moment");




const {
  calculateWorkHours,
} = require("../utils/helpers");

const {
  getDistanceMeters,
} = require("../utils/locationHelper");

// CHECK IN
const checkIn = async (req, res) => {
  try {
    const { locationType, lat, lng } =
      req.body;

    const today =
      moment().format(
        "YYYY-MM-DD"
      );

    const currentTime =
      moment().format(
        "HH:mm"
      );

    const ip =
      req.headers[
        "x-forwarded-for"
      ] ||
      req.socket.remoteAddress;

    if (
      currentTime <
      process.env.CHECKIN_START
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Too early to check in",
      });
    }

    if (
      currentTime >
      process.env.CHECKIN_END
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Late check-in not allowed",
      });
    }

    if (
      !["WFO", "WFH"].includes(
        locationType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid location type",
      });
    }

    const alreadyCheckedIn =
      await Attendance.findOne({
        userId: req.user.id,
        date: today,
      });

    if (alreadyCheckedIn) {
      return res.status(400).json({
        success: false,
        message:
          "Already checked in today",
      });
    }

    const onLeave =
      await Leave.findOne({
        userId: req.user.id,
        status: "approved",
        fromDate: {
          $lte: new Date(),
        },
        toDate: {
          $gte: new Date(),
        },
      });

    if (onLeave) {
      return res.status(400).json({
        success: false,
        message:
          "You are on leave today",
      });
    }

    if (
      locationType === "WFO"
    ) {
      const distance =
        getDistanceMeters(
          lat,
          lng,
          Number(
            process.env
              .OFFICE_LAT
          ),
          Number(
            process.env
              .OFFICE_LONG
          )
        );

      if (distance > 200) {
        return res.status(400).json({
          success: false,
          message:
            "You are not near office location",
        });
      }
    }

    let lateBy = 0;

    if (
      currentTime >
      process.env.WORK_START
    ) {
      lateBy = moment(
        currentTime,
        "HH:mm"
      ).diff(
        moment(
          process.env
            .WORK_START,
          "HH:mm"
        ),
        "minutes"
      );
    }

    const attendance =
      await Attendance.create({
        userId: req.user.id,

        date: today,

        checkIn: {
          time: currentTime,

          timestamp:
            new Date(),

          location: {
            type:
              locationType,

            lat,
            lng,
            ip,
          },
        },

        summary: {
          lateBy,
          status:
            "present",
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Checked in successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// CHECK OUT
const checkOut = async (
  req,
  res
) => {
  try {
    const { lat, lng } =
      req.body;

    const today =
      moment().format(
        "YYYY-MM-DD"
      );

    const attendance =
      await Attendance.findOne({
        userId: req.user.id,
        date: today,
      });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message:
          "Check-in not found",
      });
    }

    if (
      attendance.checkOut
        ?.timestamp
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Already checked out",
      });
    }

    const checkOutTime =
      new Date();

    attendance.checkOut = {
      time:
        moment().format(
          "HH:mm"
        ),

      timestamp:
        checkOutTime,

      location: {
        lat,
        lng,
      },
    };

    const result =
      calculateWorkHours(
        attendance.checkIn
          .timestamp,
        checkOutTime
      );

    let earlyExitBy = 0;

    const workEnd =
      moment(
        process.env
          .WORK_END,
        "HH:mm"
      );

    const current =
      moment(
        moment().format(
          "HH:mm"
        ),
        "HH:mm"
      );

    if (
      current.isBefore(
        workEnd
      )
    ) {
      earlyExitBy =
        workEnd.diff(
          current,
          "minutes"
        );
    }

    attendance.summary.totalHours =
      result.totalHours;

    attendance.summary.regularHours =
      result.regularHours;

    attendance.summary.overtime =
      result.overtime;

    attendance.summary.earlyExitBy =
      earlyExitBy;

    attendance.summary.status =
      result.status ===
      "FULL_DAY"
        ? "present"
        : result.status ===
          "HALF_DAY"
        ? "half-day"
        : "short-day";

    await attendance.save();

    res.status(200).json({
      success: true,
      message:
        "Checked out successfully",
      summary:
        attendance.summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
const allAttendance = async (
  req,
  res
) => {
  try {
    const records =
      await Attendance.find()
        .populate(
          "userId",
          "name email role employeeId"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};
const employeeAttendance =
  async (req, res) => {
    try {
      const records =
        await Attendance.find({
          userId:
            req.params.id,
        })
          .populate(
            "userId",
            "name email role employeeId"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count:
          records.length,
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// TODAY ATTENDANCE
const todayAttendance =
  async (req, res) => {
    try {
      const today =
        moment().format(
          "YYYY-MM-DD"
        );

      const attendance =
        await Attendance.findOne(
          {
            userId:
              req.user.id,
            date: today,
          }
        );

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// MONTHLY ATTENDANCE
const monthlyAttendance =
  async (req, res) => {
    try {
      const {
        year,
        month,
      } = req.params;

      const records =
        await Attendance.find(
          {
            userId:
              req.user.id,

            date: {
              $regex: `^${year}-${month.padStart(
                2,
                "0"
              )}`,
            },
          }
        );

      res.status(200).json({
        success: true,
        count:
          records.length,
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ATTENDANCE SUMMARY
const attendanceSummary =
  async (req, res) => {
    try {
      const records =
        await Attendance.find(
          {
            userId:
              req.user.id,
          }
        );

      let summary = {
        totalDays:
          records.length,
        present: 0,
        halfDay: 0,
        shortDay: 0,
        overtimeHours: 0,
      };

      records.forEach(
        (item) => {
          if (
            item.summary
              .status ===
            "present"
          )
            summary.present++;

          if (
            item.summary
              .status ===
            "half-day"
          )
            summary.halfDay++;

          if (
            item.summary
              .status ===
            "short-day"
          )
            summary.shortDay++;

          summary.overtimeHours +=
            item.summary
              .overtime || 0;
        }
      );

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  checkIn,
  checkOut,
  todayAttendance,
  monthlyAttendance,
  attendanceSummary,
    allAttendance,
  employeeAttendance
};