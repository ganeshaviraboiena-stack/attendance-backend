const bcrypt = require("bcryptjs");
const User = require("../models/User");

const {
  getAllEmployees,
  getEmployeeById,
  toggleEmployeeStatus,
} = require("./userController");

const {
  allAttendance,
  employeeAttendance,
} = require("./attendanceController");

const {
  allLeaves,
  employeeLeaves,
  approveLeave,
  rejectLeave,
} = require("./leaveController");

// CREATE SUPER ADMIN
const createSuperAdmin = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const exists =
      await User.findOne({
        role: "superadmin",
      });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "Super Admin already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const superAdmin =
      await User.create({
        name,
        email:
          email.toLowerCase(),
        password:
          hashedPassword,
        role: "superadmin",
        isActive: true,
      });

    res.status(201).json({
      success: true,
      message:
        "Super Admin created successfully",
      data: superAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// GET USER LEAVE BALANCE
const getUserLeaveBalance =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        ).select(
          "leaveBalance name email"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          userId:
            user._id,
          name:
            user.name,
          email:
            user.email,
          leaveBalance:
            user.leaveBalance,
        },
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
  createSuperAdmin,

  getAllUsers:
    getAllEmployees,

  getUserProfile:
    getEmployeeById,

  toggleUserStatus:
    toggleEmployeeStatus,

  getAllAttendance:
    allAttendance,

  getUserAttendance:
    employeeAttendance,

  getAllLeaves:
    allLeaves,

  getUserLeaves:
    employeeLeaves,

  getUserLeaveBalance,

  approveLeave,
  rejectLeave,
};