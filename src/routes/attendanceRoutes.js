const express = require("express");

const {
  checkIn,
  checkOut,
  todayAttendance,
  monthlyAttendance,
  attendanceSummary,
  allAttendance,
  employeeAttendance,
} = require("../controllers/attendanceController");

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.post(
  "/checkin",
  auth,
  checkIn
);

router.post(
  "/checkout",
  auth,
  checkOut
);

router.get(
  "/today",
  auth,
  todayAttendance
);

router.get(
  "/month/:year/:month",
  auth,
  monthlyAttendance
);

router.get(
  "/summary",
  auth,
  attendanceSummary
);

// ADMIN / MANAGER

router.get(
  "/all",
  auth,
  roleCheck(
    "admin",
    "manager"
  ),
  allAttendance
);

router.get(
  "/employee/:id",
  auth,
  roleCheck(
    "admin",
    "manager"
  ),
  employeeAttendance
);

module.exports = router;