/**
 * data/users.js
 * -------------
 * Mock "database" of users.
 *
 * In a real app this data would live in a PostgreSQL table:
 *
 *   CREATE TABLE users (
 *     id         SERIAL PRIMARY KEY,
 *     name       VARCHAR(100) NOT NULL,
 *     email      VARCHAR(150) UNIQUE NOT NULL,
 *     role       VARCHAR(20)  NOT NULL CHECK (role IN ('student','staff','admin')),
 *     password   VARCHAR(255) NOT NULL  -- bcrypt hash in production
 *   );
 *
 * The Express API would expose POST /api/auth/login which:
 *   1. Looks up the user by email
 *   2. Compares the password with bcrypt.compare()
 *   3. Returns a signed JWT: jwt.sign({ id, role }, process.env.JWT_SECRET)
 *
 * Here we skip bcrypt and JWT and do a plain string comparison
 * just to simulate the auth flow in the browser.
 */

export const MOCK_USERS = [
  {
    id: 1,
    name: "Thabo Mokoena",
    email: "student@maluti.ac.za",
    role: "student",          // Controls which pages/tabs they can see
    password: "demo1234",     // In production: bcrypt hash
    studentNumber: "MTC2024001",
    programme: "Information Technology (NQF 4)",
    year: 2,
  },
  {
    id: 2,
    name: "Sne Ndlovu",
    email: "staff@maluti.ac.za",
    role: "staff",
    password: "demo1234",
    department: "ICT Department",
    employeeId: "EMP-0042",
  },
  {
    id: 3,
    name: "Dr. Nomsa Sithole",
    email: "admin@maluti.ac.za",
    role: "admin",
    password: "demo1234",
    department: "Academic Registry",
    employeeId: "ADMIN-001",
  },
];

/**
 * Simulates a database query: SELECT * FROM users WHERE email = $1
 *
 * @param {string} email
 * @param {string} password
 * @returns {object|null} user object (without password) or null if not found
 */
export function authenticateUser(email, password) {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) return null;

  // Never return the password — mirrors what a real API should do
  const { password: _stripped, ...safeUser } = user;
  return safeUser;
}
