/**
 * data/students.js
 * ----------------
 * Mock dataset of enrolled students — used by the Admin Panel.
 *
 * In production this would come from:
 *   GET /api/admin/students
 *   → Express handler queries PostgreSQL
 *   → Returns paginated JSON array
 *
 * SQL equivalent:
 *   SELECT id, name, programme, year, status, gpa
 *   FROM students
 *   ORDER BY name ASC
 *   LIMIT $1 OFFSET $2;
 */

export const MOCK_STUDENTS = [
  { id: "MTC2024001", name: "Sinenhlanhla Dhlamini",     programme: " Computer Science",  year: 2, status: "active",    gpa: 3.4 },
  { id: "MTC2024002", name: "Zanele Khumalo",    programme: "Civil Engineering",        year: 1, status: "active",    gpa: 3.8 },
  { id: "MTC2024003", name: "Sipho Ndlovu",      programme: "Electrical Engineering",   year: 3, status: "at-risk",   gpa: 1.9 },
  { id: "MTC2024004", name: "Precious Motaung",  programme: "Business Management",      year: 2, status: "active",    gpa: 3.1 },
  { id: "MTC2024005", name: "Kagiso Sithole",    programme: "Information Technology",   year: 1, status: "inactive",  gpa: 0.0 },
  { id: "MTC2024006", name: "Amahle Dube",       programme: "Tourism & Hospitality",    year: 2, status: "active",    gpa: 3.6 },
  { id: "MTC2024007", name: "Tebogo Molefe",     programme: "Mechanical Engineering",   year: 3, status: "active",    gpa: 2.8 },
  { id: "MTC2024008", name: "Palesa Mosia",      programme: "Early Childhood Dev.",     year: 1, status: "at-risk",   gpa: 1.7 },
  { id: "MTC2024009", name: "Lebo Mahlangu",     programme: "Business Management",      year: 3, status: "active",    gpa: 3.9 },
  { id: "MTC2024010", name: "Nkosi Radebe",      programme: "Civil Engineering",        year: 2, status: "inactive",  gpa: 0.0 },
  { id: "MTC2024011", name: "Dineo Phiri",       programme: "Electrical Engineering",   year: 1, status: "active",    gpa: 2.5 },
  { id: "MTC2024012", name: "Bongani Shabalala",  programme: "Information Technology",  year: 3, status: "active",    gpa: 3.2 },
];

