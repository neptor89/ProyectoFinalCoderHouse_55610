import config from "../config/config.js";
import { usersService } from "../services/service.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import {
  sendResetPasswordEmail,
  sendDeleteInactiveUserEmail,
} from "../utils/email.js";
import { generateTokenResetPassword, decodeJWT } from "../utils/passport.js";
import logger from "../utils/logger.js";

export const getUsersController = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserController = async (req, res) => {
  try {
    let userId = req.params.userId;
    const user = await usersService.getOne(userId);
    if (!user) {
      res.status(202).json({ message: "User not found with ID: " + userId });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    let userId = req.params.userId;
    const user = await usersService.delete(userId);
    if (!user) {
      res.status(202).json({ message: "User not found with ID: " + userId });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInactiveUsersController = async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const inactiveUsers = await usersService.getAll();

    const filteredUsers = inactiveUsers.filter((user) => {
      const lastConnectionDate = new Date(user.last_connection);

      if (isNaN(lastConnectionDate.getTime())) {
        logger.error("Invalid last conection date", user.last_connection);
        return false;
      }

      const isoLastConnectionDate = lastConnectionDate.toISOString();

      const isoTwoDaysAgo = twoDaysAgo.toISOString();

      return isoLastConnectionDate < isoTwoDaysAgo;
    });

    await Promise.all(
      filteredUsers.map(async (user) => {
        await sendDeleteInactiveUserEmail(user.email);
      })
    );

    const deleteResults = await Promise.all(
      filteredUsers.map(async (user) => {
        return await usersService.delete(user._id);
      })
    );

    logger.info(`${deleteResults.length} inactive users deleted.`);
    res.json({ message: `${deleteResults.length} inactive users deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPasswordEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersService.getByEmail(email);
    if (!user)
      res.status(202).json({ message: "User not found with email: " + email });

    const token = generateTokenResetPassword(user);

    await sendResetPasswordEmail(email, token);
    res.json("Reset password email sended");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = decodeJWT(token, config.resetPasswordKey);
    if (isValidPassword(user.user, password)) {
      return res.status(400).json({
        status: "error",
        message: "You can't enter the same password you had before",
      });
    }
    const hashedPassword = createHash(password);
    let result = await usersService.updateOne(
      { _id: user.user._id },
      { password: hashedPassword }
    );
    return res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changeUserRoleController = async (req, res) => {
  try {
    let userId = req.params.uid;
    const user = await usersService.changeUserRole(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
