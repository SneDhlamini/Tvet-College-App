# Tvet-College-App
A single-page React application demonstrating frontend, auth simulation, role-based access control, database-driven UI  and PDF upload for staff
## File Structure

```
tvet-college/
├── README.md                        
├── package.json                     ← Dependencies & scripts
├── public/
│   └── index.html                   ← HTML shell (React mounts here)
└── src/
    ├── index.js                     ← Entry point — renders <App />
    ├── App.jsx                      ← Root component — routing logic
    │
    ├── context/
    │   └── AuthContext.jsx          ← Global auth state (React Context API)
    │
    ├── data/
    │   ├── users.js                 ← Mock user "database" (simulates PostgreSQL)
    │   └── students.js              ← Mock student records for admin table
    │
    ├── hooks/
    │   └── useAuth.js               ← Custom hook — reads AuthContext cleanly
    │
    ├── components/
    │   ├── LoginForm.jsx            ← Auth form — role selector + password
    │   ├── Navbar.jsx               ← Top nav — role-aware navigation links
    │   ├── ProtectedRoute.jsx       ← Guards routes from unauthorized access
    │   └── PDFUploader.jsx          ← Staff-only PDF upload component
    │
    ├── pages/
    │   ├── Dashboard.jsx            ← Home after login — role-specific cards
    │   ├── Courses.jsx              ← Student: course list with progress bars
    │   ├── Intranet.jsx             ← Shared notice board (student + staff)
    │   ├── AdminPanel.jsx           ← Admin: searchable student table
    │   └── StaffPortal.jsx          ← Staff: PDF upload + document manager
    │
    └── styles/
        ├── global.css               ← CSS variables, resets, base styles
        ├── login.css                ← Login form styles
        ├── navbar.css               ← Navigation styles
        ├── dashboard.css            ← Dashboard card grid styles
        ├── courses.css              ← Course list + progress bar styles
        ├── admin.css                ← Student table + filter styles
        └── staff.css                ← PDF uploader + document list styles
```

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open http://localhost:3000
```

---

## Demo Credentials

| Role    | Password   | Access                              |
|---------|------------|-------------------------------------|
| Student | demo1234   | Dashboard, Courses, Intranet        |
| Staff   | demo1234   | Dashboard, Intranet, Staff Portal   |
| Admin   | demo1234   | Everything + Admin Panel            |

---



