const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedErr = require("../errors/unauthorized-err");

const auth = (req, res, next) => {
  const publicRoutes = [
    { method: "POST", path: "/signin" },
    { method: "POST", path: "/signup" },
    { method: "GET", path: "/items" },
    { method: "GET", path: "/" },
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => req.method === route.method && req.path === route.path
  );

  if (isPublicRoute) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthorizedErr("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    return next();
  } catch (err) {
    throw new UnauthorizedErr("Authorization required");
  }
};

module.exports = auth;
