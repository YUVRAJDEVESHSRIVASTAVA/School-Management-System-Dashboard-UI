# 🏫 School Management System

A full-stack School ERP web application built with **Spring Boot** (backend) and **Vanilla HTML/CSS/JS** (frontend), backed by **PostgreSQL**. Supports role-based access for Students and Teachers with complete attendance and marks management.

---

## ✨ Features

### 👨‍🎓 Student Portal
- Secure login via backend authentication
- Personal dashboard — attendance %, average marks, subject-wise grades
- View own attendance records with Present / Absent / Late breakdown
- View own marks by subject and exam type
- View academic results

### 👩‍🏫 Teacher Portal
- Login with predefined teacher credentials
- Dashboard with total student count and recent activity
- **Mark Attendance** — select class, section and date; bulk-mark Present / Absent / Late
- **Enter Marks** — select class, exam type and subject; enter decimal marks per student
- View all attendance and marks with search & filter
- Add new students and teachers
- Manage student and teacher lists

### 🔒 Security
- Students can only see their own data — no cross-student data leakage
- Admin/teacher-only pages redirect students automatically
- No flash of privileged content on page load

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2.3 |
| Database | PostgreSQL 18 |
| ORM | Spring Data JPA / Hibernate |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Build Tool | Maven 3.9.9 |
| Icons | Font Awesome 6.5 |

---

## 📁 Project Structure

```
school-management-system/
├── backend/                        # Spring Boot application
│   ├── src/main/java/com/school/
│   │   ├── controller/             # REST API controllers
│   │   ├── entity/                 # JPA entities
│   │   ├── service/                # Business logic
│   │   ├── repository/             # Spring Data repositories
│   │   ├── dto/                    # Data Transfer Objects
│   │   └── config/                 # CORS config
│   └── src/main/resources/
│       ├── application.properties  # DB config
│       └── data.sql                # Seed data
├── frontend/
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html          # Student dashboard
│   │   ├── teacher-dashboard.html  # Teacher dashboard
│   │   ├── students/               # Student list & add
│   │   ├── teachers/               # Teacher list & add
│   │   ├── attendance/             # View, mark attendance
│   │   ├── marks/                  # View, enter marks
│   │   └── results/                # View results
│   └── assets/
│       ├── css/                    # Stylesheets
│       └── js/
│           ├── api.js              # All backend API calls
│           └── login.js            # Auth helpers
└── database/
    ├── schema.sql                  # Table definitions
    └── seed-all-data.sql           # Sample data
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- PostgreSQL 14+
- Any static file server (VS Code Live Server, Python `http.server`, etc.)

### 1. Database Setup

```sql
-- Create the database
CREATE DATABASE school_db;
```

Then run the schema and seed files:

```bash
psql -U postgres -d school_db -f database/schema.sql
psql -U postgres -d school_db -f database/seed-all-data.sql
```

### 2. Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/school_db
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### 3. Start the Backend

```powershell
& "mvn.cmd" -f "backend/pom.xml" org.springframework.boot:spring-boot-maven-plugin:run
```

Or on Linux/macOS:

```bash
./backend/mvnw spring-boot:run
```

Backend runs at **http://localhost:8080**

### 4. Start the Frontend

```bash
# Python (any OS)
python -m http.server 5500

# Or use VS Code Live Server extension
```

Open **http://127.0.0.1:5500/frontend/pages/login.html**

---

## 🔑 Default Credentials

### Students (40 accounts — sample)

| Roll No | Name | Email | Password |
|---|---|---|---|
| STD-2026-0001 | Aarav Mehta | aarav.mehta@school.edu | Aarav@123 |
| STD-2026-0011 | Rahul Sharma | rahul.sharma@school.edu | Rahul@123 |
| STD-2026-0021 | Aditya Kapoor | aditya.kapoor@school.edu | Aditya@123 |
| STD-2026-0031 | Aryan Kapoor | aryan.kapoor@school.edu | Aryan@123 |

> Full student list in [`Student Detail/Data of student.md`](Student%20Detail/Data%20of%20student.md)

### Teachers

| Name | Email | Password | Subject |
|---|---|---|---|
| Admin | admin@school.edu | Admin@123 | Administration |
| Rajesh Kumar | rajesh.kumar@school.edu | Rajesh@123 | Mathematics |
| Priya Nair | priya.nair@school.edu | Priya@123 | Science |
| Sunita Sharma | sunita.sharma@school.edu | Sunita@123 | English |
| Amit Tiwari | amit.tiwari@school.edu | Amit@123 | Hindi |
| Kavya Menon | kavya.menon@school.edu | Kavya@123 | Computer Science |
| Ravi Shankar | ravi.shankar@school.edu | Ravi@123 | Physical Education |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Student login |
| GET | `/api/students` | All students |
| GET | `/api/students/class/{cls}/section/{sec}` | Students by class & section |
| GET | `/api/attendance/roll/{rollNumber}` | Student's attendance |
| POST | `/api/attendance/student/{id}` | Save attendance record |
| GET | `/api/marks/roll/{rollNumber}` | Student's marks |
| POST | `/api/marks/student/{id}` | Save marks record |
| GET | `/api/teachers` | All teachers |
| POST | `/api/teachers` | Add new teacher |

---

## 📸 Screenshots

> Login page, student dashboard, mark attendance, and enter marks pages.

| Login | Student Dashboard |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Mark Attendance | Enter Marks |
|---|---|
| ![Attendance](docs/screenshots/mark-attendance.png) | ![Marks](docs/screenshots/enter-marks.png) |

---

## 🧑‍💻 Development Notes

- **CORS** is configured to allow all origins (`*`) for local development
- **`api.js`** uses `http://127.0.0.1:8080` (not `localhost`) to avoid IPv6 resolution issues in Chromium browsers
- **Marks** support decimal values (e.g. `67.5`) stored as `DOUBLE PRECISION` in PostgreSQL
- **Role-based UI** — admin elements have `style="display:none"` in HTML to prevent flash-of-content; revealed via JS only for teachers

---

## 📄 License

This project is for educational purposes.

---

