const DB = require("../models");

const UserRoleModel = DB.UserRole;

const userHasRole = async (userId, roleId) => {
  try {
    const checkRole = await UserRoleModel.findOne({
      where: {
        user_id: userId,
        role_id: roleId,
      },
    });
    return !!checkRole;
  } catch (error) {
    console.log("Error in UserHasRole Check : ", error.message);
  }
};

module.exports = { userHasRole };
