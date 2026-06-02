const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt =
  require("bcryptjs");

const authenticateWithIMAP = require(
  "../utils/imapAuth"
);

const getRoleFromEmail = (
  email
) => {
  const mail =
    email.toLowerCase();

  if (
    mail.includes(
      "devops"
    )
  ) {
    return "admin";
  }

  if (
    mail.includes(
      "manager"
    )
  ) {
    return "manager";
  }

  if (
    mail.includes(
      ".dev@"
    ) ||
    mail.includes(
      "dev@"
    )
  ) {
    return "employee";
  }

  return "employee";
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

   

// Check Super Admin First
const superAdmin =
  await User.findOne({
    email: email.toLowerCase(),
    role: "superadmin",
  });

if (superAdmin) {
  const isMatch =
    await bcrypt.compare(
      password,
      superAdmin.password
    );

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: superAdmin._id,
      role: superAdmin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRE,
    }
  );

  return res.status(200).json({
    success: true,
    message:
      "Super Admin Login Successful",
    token,
    user: {
      id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role,
    },
  });
}

// Normal IMAP Login Below
const imapResult =
  await authenticateWithIMAP(
    email,
    password
  );

    if (!imapResult.success) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    let user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    // Auto Create User On First Login
    if (!user) {
      const role =
  getRoleFromEmail(
    email
  );

      let name =
        email.split("@")[0];

      name = name
        .replace(/[._]/g, " ")
        .split(" ")
        .map(
          (word) =>
            word
              .charAt(0)
              .toUpperCase() +
            word.slice(1)
        )
        .join(" ");

      user =
        await User.create({
          name,
          email:
            email.toLowerCase(),
          role,
        });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Account is inactive",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        managerId:
          user.managerId,
        adminId:
          user.adminId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRE,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      token,
      user: {
        id: user._id,
        employeeId:
          user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department:
          user.department,
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

// MY PROFILE
const getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      )
        .populate(
          "managerId",
          "name email"
        )
        .populate(
          "adminId",
          "name email"
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
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// CHANGE PASSWORD
const changePassword =
  async (req, res) => {
    return res.status(400).json({
      success: false,
      message:
        "Password is managed through webmail account. Please change it in cPanel/Webmail.",
    });
  };

// LOGOUT
const logout = async (
  req,
  res
) => {
    try {
      res.status(200).json({
        success: true,
        message:
          "Logged out successfully",
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
  login,
  getProfile,
  changePassword,
  logout,
};