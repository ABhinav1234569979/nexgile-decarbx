// Role-based authorization middleware.
// Must run AFTER `authenticate` (relies on req.user set by the JWT middleware).
//
// Usage:
//   router.post("/", authorize("Admin", "Sustainability Manager"), handler);
//
// If no roles are passed, this just checks that a user is attached
// (i.e. behaves as a no-op beyond `authenticate`), so it fails safe
// rather than silently allowing everyone through.
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      // authenticate() should have already caught this, but don't assume.
      return res.status(401).json({ error: "Authentication required" });
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action" });
    }

    next();
  };
}

// Canonical role names, used consistently across the backend so a typo
// in a route file doesn't silently create a hole in the permission model.
export const ROLES = {
  ADMIN: "Admin",
  MANAGER: "Sustainability Manager",
  ANALYST: "Analyst",
};

export const CAN_MANAGE = [ROLES.ADMIN, ROLES.MANAGER];
export const CAN_VIEW = [ROLES.ADMIN, ROLES.MANAGER, ROLES.ANALYST];
