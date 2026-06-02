const User = require("../models/User");

// GET ALL ADMINS
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
    }).populate(
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



// PUBLIC EMPLOYEES
const getAllEmployeesPublic = async (
  req,
  res
) => {
  try {
    const employees = await User.find({
      role: "employee",
    });

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

module.exports = {
    getAllEmployeesPublic,
  getAllAdmins,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
};