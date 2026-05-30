const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CREATE ADMIN
const createAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_ROUNDS)
    );

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: "admin",
      managerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE EMPLOYEE
const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      department,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email },
        { employeeId }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Employee email or employeeId already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_ROUNDS)
    );

    const employee = await User.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      department,
      role: "employee",

      managerId:
        req.user.role === "manager"
          ? req.user.id
          : req.user.managerId,

      adminId:
        req.user.role === "admin"
          ? req.user.id
          : null,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL ADMINS
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
    })
      .select("-password")
      .populate(
        "managerId",
        "name email"
      );

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL EMPLOYEES
const getAllEmployees = async (
  req,
  res
) => {
  try {
    const employees = await User.find({
      role: "employee",
    })
      .select("-password")
      .populate(
        "managerId",
        "name email"
      )
      .populate(
        "adminId",
        "name email"
      );

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE EMPLOYEE
const getEmployeeById = async (
  req,
  res
) => {
  try {
    const employee =
      await User.findById(
        req.params.id
      )
        .select("-password")
        .populate(
          "managerId",
          "name email"
        )
        .populate(
          "adminId",
          "name email"
        );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE EMPLOYEE
const updateEmployee = async (
  req,
  res
) => {
  try {
    const employee =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE EMPLOYEE
const deleteEmployee = async (
  req,
  res
) => {
  try {
    const employee =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ACTIVATE / DEACTIVATE
const toggleEmployeeStatus =
  async (req, res) => {
    try {
      const employee =
        await User.findById(
          req.params.id
        );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee not found",
        });
      }

      employee.isActive =
        !employee.isActive;

      await employee.save();

      res.status(200).json({
        success: true,
        message: employee.isActive
          ? "Employee activated"
          : "Employee deactivated",
        data: employee,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
  const createManager = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_ROUNDS)
      );

    const manager =
      await User.create({
        name,
        email,
        password: hashedPassword,
        department,
        role: "manager",
      });

    res.status(201).json({
      success: true,
      message: "Manager created successfully",
      data: manager,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAdmin,
  createEmployee,
  getAllAdmins,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  createManager,
};