const Leave = require("../models/Leave");
const User = require("../models/User");
const applyLeave = async (req, res) => {
  try {
    const {
      type,
      duration,
      halfDaySession,
      fromDate,
      toDate,
      reason,
    } = req.body;

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    const totalDays =
      Math.ceil(
        (endDate - startDate) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const leave = await Leave.create({
      userId: req.user.id,
      type,
      duration,
      halfDaySession,
      fromDate,
      toDate,
      totalDays,
      reason,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message:
        "Leave request submitted successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const approveLeave = async (req, res) => {
  try {
    const leave =
      await Leave.findById(req.params.id);

    if (!leave) {
        if (leave.status !== "pending") {
  return res.status(400).json({
    success: false,
    message:
      "Leave has already been processed",
  });
}
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    const user = await User.findById(
      leave.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const balance =
      user.leaveBalance[leave.type];

    if (balance < leave.totalDays) {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient leave balance",
      });
    }

    user.leaveBalance[leave.type] -=
      leave.totalDays;

    await user.save();

    leave.status = "approved";
    leave.approvedBy = req.user.id;
    leave.approvedAt = new Date();

    await leave.save();

    res.status(200).json({
      success: true,
      message:
        "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const employeeLeaves =
  async (req, res) => {
    try {
      const leaves =
        await Leave.find({
          userId:
            req.params.id,
        })
          .populate(
            "userId",
            "name email employeeId"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count:
          leaves.length,
        data: leaves,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
const rejectLeave = async (req, res) => {
  try {
    const { rejectionReason } =
      req.body;

    const leave =
      await Leave.findById(req.params.id);

    if (!leave) {
        if (leave.status !== "pending") {
  return res.status(400).json({
    success: false,
    message:
      "Leave has already been processed",
  });
}
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    leave.status = "rejected";
    leave.rejectionReason =
      rejectionReason;
    leave.approvedBy = req.user.id;

    await leave.save();

    res.status(200).json({
      success: true,
      message:
        "Leave rejected successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const leaveHistory = async (req, res) => {
  try {
    const leaves = await Leave.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const leaveBalance = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("leaveBalance");

    res.status(200).json({
      success: true,
      data: user.leaveBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const allLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate(
        "userId",
        "name email employeeId"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  applyLeave,
  approveLeave,
  rejectLeave,
  leaveHistory,
  leaveBalance,
  allLeaves,
    employeeLeaves
};