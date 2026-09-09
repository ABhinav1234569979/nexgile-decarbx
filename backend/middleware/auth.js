import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  // Fail loudly at startup rather than throwing an opaque error on the
  // first login/verify call. Copy backend/.env.example to backend/.env
  // and set a real secret before running the server.
  throw new Error(
    "JWT_SECRET is not set. Create backend/.env (see backend/.env.example) with a JWT_SECRET value."
  );
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
