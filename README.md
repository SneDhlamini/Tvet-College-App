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

# Maluti TVET College Website

A modern web platform built to centralize information, improve communication, and enhance digital accessibility for Maluti TVET College students, staff, and stakeholders.

---

## 📌 Problem Statement

The college previously had limited centralized access to key information. Students and staff often struggled to find updated announcements, course details, and departmental information, leading to delays in communication and a fragmented user experience.

This project solves that by providing a single, structured, and easy-to-use website that consolidates all essential college information in one place.

---

## 🚀 Features

- Clean and responsive homepage
- Department and course listings
- Announcements section for updates and notices
- Structured information pages for college details
- Easy navigation for students and staff
- Mobile-friendly design for all devices
- Modular structure for future expansion (e.g. intranet or student portal)

---

## 🛠️ Tech Stack

*(Update this based on your actual implementation)*

- HTML5 / CSS3 / JavaScript
- [React / Next.js]
- Styling: CSS

---

## 📦 Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/maluti-tvet-website.git
