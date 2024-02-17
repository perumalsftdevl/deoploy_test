import errorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";

const verifyUserToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    // Token is not present
    return next(errorHandler(401, "Unauthorized: Token not provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token is present but not valid
      return next(errorHandler(401, "Unauthorized: Invalid token"));
    }

    // Token is valid, set user information on request
    req.user = user;
    next();
  });
};

export default verifyUserToken;
