const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(401, "UnAuthorized");
  }

  try {
    Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(403, "Forbidden");
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
