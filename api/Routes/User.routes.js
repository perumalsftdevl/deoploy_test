import Express from "express";
import verifyToken from "../utils/verifyToken.js";
import bcryptjs from "bcryptjs";
import User from "../Models/User.model.js";
import errorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose";
import verifyUserToken from "../utils/verifyUser.js";

const router = Express.Router();

router.get("/getUser", async (req, res, next) => {
  try {
    const ListUser = await User.find();
    return res.status(200).json({
      status: true,

      message: "User Fetch SuccessFully",
      record: ListUser,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/getUserById", async (req, res, next) => {
  try {
    let ListUser = await User.findById(req.query.id);

    return res.status(ListUser && ListUser.length !== null ? 200 : 404).json({
      status: true,

      message:
        ListUser && ListUser.length !== null
          ? "User Fetch Successfully"
          : "User Not Found",
      record: ListUser || [],
    });
  } catch (error) {
    next(error);
  }
});

router.get("/DeleteUserById", verifyUserToken, async (req, res, next) => {
  console.log(req.query.id);
  try {
    let ListUser = await User.findByIdAndDelete(req.query.id);
    if (!ListUser) {
      return res.status(404).json({ status: true, msg: "record not found" });
    }
    return res
      .status(200)
      .json({
        status: true,

        message: "User Delete Successfully",
      })
      .clearCookie("access_token");
  } catch (error) {
    return next(error);
  }
});

router.post("/update", verifyUserToken, async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User not found",
      });
    }
    const validUser = await User.findOne({ _id: req.user.id });

    const { password, ...rest } = updateUser._doc;
    return res.status(200).json({
      status: true,
      validUser,
      message: "User updated successfully",
    });
  } catch (error) {
    return next(error);
  }
});

const UserRouter = router;

export default UserRouter;
