const { error, success } = require("../helper/baseResponse");
const {
  ADMIN_ROLE_ID,
  CLIENT_ROLE_ID,
  JWT_KEY,
} = require("../helper/constants");
const { userHasRole } = require("../helper/userHasRole");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DB = require("../models");
const generateOtp = require("../helper/generateOtp");
const sendMail = require("../helper/sendMail");
const UserModel = DB.User;
const UserRoleModel = DB.UserRole;
const RoleModel = DB.Role;

const createUser = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(403).json(error("User not authorized", 403));
    }

    const { username, password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt);

    let newUser = await UserModel.create({
      username,
      password: securedPassword,
      email,
    });

    const roleAssigned = await UserRoleModel.create({
      user_id: newUser.id,
      role_id: CLIENT_ROLE_ID,
    });

    newUser = await UserModel.findOne({
      where: {
        username,
      },
      include: {
        model: UserRoleModel,
        attributes: ["role_id"],
        include: {
          model: RoleModel,
          attributes: ["name"],
        },
      },
    });

    return res
      .status(201)
      .json(success("User Created Successfully", newUser.dataValues, 201));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await UserModel.findOne({
      where: {
        username,
      },
      include: [
        {
          model: UserRoleModel,
          attributes: ["role_id"],
          include: {
            model: RoleModel,
            attributes: ["name"],
          },
        },
      ],
    });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json(error("Wrong Password Entered", 400));

    const payload = { user };
    const jwt_token = await jwt.sign(payload, JWT_KEY);

    user = {
      ...user.dataValues,
      token: jwt_token,
    };

    return res.status(200).json(success("Logged in successfully", user, 200));
  } catch (err) {
    return res.status(500).json(error(err.message), 500);
  }
};

const generateOtpForPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOtp(6);
    await sendMail(email, "OTP", "OTP is " + otp);
    await UserModel.update(
      {
        otp,
      },
      {
        where: {
          email,
        },
      }
    );
    return res.status(200).json(success("OK", otp, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, otp, email } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json(error("Confirm Password don't match", 400));
    }

    const user = await UserModel.findOne({
      where: {
        email,
      },
    });

    console.log(user?.otp, otp);

    if (user?.otp != otp) {
      return res.status(400).json(error("Invalid OTP entered", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          email,
        },
      }
    );

    return res
      .status(200)
      .json(success("Updated", "User password updated", 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const listUser = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(403).json(error("User is not authorized", 403));
    }

    const listClients = await UserRoleModel.findAll({
      where: {
        role_id: CLIENT_ROLE_ID,
      },
      include: {
        model: UserModel,
        attributes: ["id", "username", "email"],
      },
    });

    return res.status(200).json(success("OK", listClients, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = {
  createUser,
  login,
  generateOtpForPasswordReset,
  resetPassword,
  listUser,
};
