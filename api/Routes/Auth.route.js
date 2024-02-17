import Express from "express";
import User from "../Models/User.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/errorHandler.js";
import Jwt from "jsonwebtoken";
const router = Express.Router();

router.post("/signup", async (req, res, next) => {
  const { username, password, email } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    password: hashPassword,
    email,
    avatar:
      "https://media.istockphoto.com/id/1388253782/photo/positive-successful-millennial-business-professional-man-head-shot-portrait.jpg?s=1024x1024&w=is&k=20&c=v0FzN5RD19wlMvrkpUE6QKHaFTt5rlDSqoUV1vrFbN4=",
  });
  try {
    await newUser.save();
    res.status(200).json({
      status: true,

      message: "User Added SuccessFully",
    });
  } catch (error) {
    // next(errorHandler(500,'Internal Server Error'));
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Wrong Credentials"));
    }

    const token = Jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Omit the password field from the response
    const { password: userPassword, ...rest } = validUser._id;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({
        validUser,
        status: true,
        message: "Login Successfully",
      });
  } catch (error) {
    next(error);
  }
});

router.post("/google", async (req, res, next) => {
  try {
    const validUser = await User.findOne({ email: req.body.email });

    if (validUser) {
      const token = Jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true, secure: true })
        .status(200)
        .json({
          validUser,
          status: true,
          message: "Login Successfully",
        });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        username: req.body.name,
        password: hashPassword,
        email: req.body.email,
        avatar: req.body.avatar,
      });

      await newUser.save();
      const validUser = await User.findOne({ email: req.body.email });

      const token = Jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res
        .cookie("access_token", token, { httpOnly: true, secure: true })
        .status(200)
        .json({
          validUser,
          status: true,
          message: "Login Successfully",
        });
    }
  } catch (error) {
    console.error(error);
    // next(error);
  }
});

const authRoute = router;
export default authRoute;
