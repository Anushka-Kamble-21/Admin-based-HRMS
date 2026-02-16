import jwt from "jsonwebtoken";

const SERVER_START = Date.now();

const authMiddleware = (req, res, next) => {
 
  //ALLOW CORS PREFLIGHT
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization token missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    if (decoded.iat * 1000 < SERVER_START) {
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;
