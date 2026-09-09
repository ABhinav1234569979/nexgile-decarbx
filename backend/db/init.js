import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "decarbx.db"));

db.pragma("journal_mode = WAL");

db.exec(`
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS emissions;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL
);

CREATE TABLE emissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  scope TEXT NOT NULL,
  facility TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  quantity REAL NOT NULL,
  emission_factor REAL NOT NULL,
  co2_emissions REAL NOT NULL,
  date TEXT NOT NULL
);

CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL,
  score INTEGER NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  material TEXT NOT NULL,
  manufacturing_emissions REAL NOT NULL,
  transportation_emissions REAL NOT NULL,
  total_footprint REAL NOT NULL
);
`);

const insertUser = db.prepare(
  "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
);
const hash = (pw) => bcrypt.hashSync(pw, 10);

insertUser.run("Admin User", "admin@nexgile.com", hash("admin123"), "Admin");
insertUser.run("Sustainability Manager", "manager@nexgile.com", hash("manager123"), "Sustainability Manager");
insertUser.run("Analyst", "analyst@nexgile.com", hash("analyst123"), "Analyst");

const insertFacility = db.prepare(
  "INSERT INTO facilities (name, location, type) VALUES (?, ?, ?)"
);
insertFacility.run("Hyderabad Office", "Hyderabad, India", "Office");
insertFacility.run("Bangalore Office", "Bangalore, India", "Office");
insertFacility.run("Manufacturing Plant", "Chennai, India", "Manufacturing");

const insertEmission = db.prepare(
  `INSERT INTO emissions (source, scope, facility, activity_type, quantity, emission_factor, co2_emissions, date)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);
const emissionSeed = [
  ["Diesel Generator", "Scope 1", "Manufacturing Plant", "Fuel Combustion", 1200, 2.68, "2026-01-15"],
  ["Company Vehicles", "Scope 1", "Hyderabad Office", "Fuel Combustion", 800, 2.31, "2026-02-10"],
  ["Grid Electricity", "Scope 2", "Bangalore Office", "Purchased Electricity", 15000, 0.82, "2026-01-20"],
  ["Grid Electricity", "Scope 2", "Manufacturing Plant", "Purchased Electricity", 22000, 0.82, "2026-03-05"],
  ["Business Travel", "Scope 3", "Hyderabad Office", "Air Travel", 500, 0.15, "2026-02-25"],
  ["Purchased Goods", "Scope 3", "Manufacturing Plant", "Supply Chain", 3000, 1.4, "2026-03-18"],
  ["Employee Commuting", "Scope 3", "Bangalore Office", "Commuting", 1800, 0.12, "2026-04-02"],
  ["Waste Disposal", "Scope 3", "Manufacturing Plant", "Waste", 900, 0.45, "2026-04-20"],
];
for (const [source, scope, facility, activity_type, quantity, emission_factor, date] of emissionSeed) {
  const co2 = quantity * emission_factor;
  insertEmission.run(source, scope, facility, activity_type, quantity, emission_factor, co2, date);
}

const insertSupplier = db.prepare(
  "INSERT INTO suppliers (name, industry, country, score) VALUES (?, ?, ?, ?)"
);
const supplierSeed = [
  ["GreenSteel Ltd", "Manufacturing", "India", 85],
  ["EcoPack Solutions", "Packaging", "India", 72],
  ["CarbonHeavy Logistics", "Logistics", "China", 45],
  ["SolarTech Components", "Electronics", "Germany", 91],
  ["Global Freight Co", "Logistics", "USA", 58],
];
for (const s of supplierSeed) insertSupplier.run(...s);

const insertProduct = db.prepare(
  `INSERT INTO products (name, material, manufacturing_emissions, transportation_emissions, total_footprint)
   VALUES (?, ?, ?, ?, ?)`
);
const productSeed = [
  ["Steel Bracket", "Recycled Steel", 12.5, 3.2],
  ["Circuit Board Unit", "Composite/Copper", 28.4, 5.1],
  ["Aluminum Casing", "Aluminum", 18.7, 4.4],
  ["Plastic Housing", "ABS Plastic", 9.3, 2.1],
];
for (const [name, material, mfg, transport] of productSeed) {
  insertProduct.run(name, material, mfg, transport, mfg + transport);
}

console.log("Database seeded successfully.");
db.close();
