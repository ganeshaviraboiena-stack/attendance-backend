const express = require("express");

const {
  applyLeave,
  approveLeave,
  rejectLeave,
  leaveHistory,
  leaveBalance,
  allLeaves,
  employeeLeaves,
} = require("../controllers/leaveController");

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.post(
  "/apply",
  auth,
  applyLeave
);

router.get(
  "/history",
  auth,
  leaveHistory
);

router.get(
  "/balance",
  auth,
  leaveBalance
);

router.get(
  "/all",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  allLeaves
);

router.get(
  "/employee/:id",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  employeeLeaves
);

router.put(
  "/:id/approve",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  approveLeave
);

router.put(
  "/:id/reject",
  auth,
  roleCheck(
    "manager",
    "admin"
  ),
  rejectLeave
);

module.exports = router;