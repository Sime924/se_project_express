const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_ACCESS } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const publicRoutes = [
    { method: "POST", path: "/signin" },
    { method: "POST", path: "/signup" },
    { method: "GET", path: "/items" },
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => req.method === route.method && req.path === route.path
  );

  if (isPublicRoute) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(UNAUTHORIZED_ACCESS)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    return next();
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ACCESS)
      .send({ message: "Authorization required" });
  }
};

module.exports = auth;
