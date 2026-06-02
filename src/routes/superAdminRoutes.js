const express = require("express");

const {
  createSuperAdmin,

  getAllUsers,
  getUserProfile,
  toggleUserStatus,

  getAllAttendance,
  getUserAttendance,

  getAllLeaves,
  getUserLeaves,
  getUserLeaveBalance,

  approveLeave,
  rejectLeave,
} = require(
  "../controllers/superAdminController"
);

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Super Admin Creation
|--------------------------------------------------------------------------
*/

router.post(
  "/create-superadmin",
  createSuperAdmin
);

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

router.get(
  "/users",
  auth,
  roleCheck("superadmin"),
  getAllUsers
);

router.get(
  "/users/:id",
  auth,
  roleCheck("superadmin"),
  getUserProfile
);

router.patch(
  "/users/:id/status",
  auth,
  roleCheck("superadmin"),
  toggleUserStatus
);

router.get(
  "/users/:id/leave-balance",
  auth,
  roleCheck("superadmin"),
  getUserLeaveBalance
);

/*
|--------------------------------------------------------------------------
| Attendance
|--------------------------------------------------------------------------
*/

router.get(
  "/attendance",
  auth,
  roleCheck("superadmin"),
  getAllAttendance
);

router.get(
  "/users/:id/attendance",
  auth,
  roleCheck("superadmin"),
  getUserAttendance
);

/*
|--------------------------------------------------------------------------
| Leaves
|--------------------------------------------------------------------------
*/

router.get(
  "/leaves",
  auth,
  roleCheck("superadmin"),
  getAllLeaves
);

router.get(
  "/users/:id/leaves",
  auth,
  roleCheck("superadmin"),
  getUserLeaves
);

router.put(
  "/leaves/:id/approve",
  auth,
  roleCheck("superadmin"),
  approveLeave
);

router.put(
  "/leaves/:id/reject",
  auth,
  roleCheck("superadmin"),
  rejectLeave
);

module.exports = router;