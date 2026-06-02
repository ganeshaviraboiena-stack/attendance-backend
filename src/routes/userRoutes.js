const express = require("express");

const {
    getAllEmployeesPublic,
  getAllAdmins,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.get(
  "/employees/public",
  getAllEmployeesPublic
);

router.get(
  "/admins",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  getAllAdmins
);

router.get(
  "/employees",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  getAllEmployees
);

router.get(
  "/employee/:id",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  getEmployeeById
);

router.put(
  "/employee/:id",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  updateEmployee
);

router.delete(
  "/employee/:id",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  deleteEmployee
);

router.patch(
  "/employee/:id/status",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  toggleEmployeeStatus
);

module.exports = router;