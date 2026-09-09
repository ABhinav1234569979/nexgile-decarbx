// Side-effect-only module: loads backend/.env into process.env.
//
// This MUST be the very first import in server.js (before any route or
// middleware imports). ES module imports are evaluated in the order they
// appear, fully, before the importing file's own top-level code runs — so
// if dotenv.config() were called from inside server.js's body instead,
// every module imported above it (including the JWT middleware) would
// already have been evaluated with process.env.JWT_SECRET still unset.
import dotenv from "dotenv";

dotenv.config();
