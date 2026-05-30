const express = require("express");

const {
  login,
  getProfile,
  changePassword,
  logout,
} = require("../controllers/authController");

const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/login",
  login
);

router.get(
  "/me",
  auth,
  getProfile
);

router.put(
  "/change-password",
  auth,
  changePassword
);

router.post(
  "/logout",
  auth,
  logout
);

module.exports = router;