# Budgeting Web Application Project Plan

## **Project Overview**
- **Goal:** Build a lightweight, secure web-based budgeting application.
- **Tech Stack:** 
  - Backend: Python (Flask)
  - Frontend: HTML, CSS, Jinja2 (Flask templates)
  - Database: SQLite (or PostgreSQL if scaling required)
  - Authentication: Flask-JWT-Extended (JWT-based) or Flask-Login (session-based)
  - Containerization: Podman
  - Deployment: (e.g., Fly.io, AWS, local deployment)

---

## **Project Milestones**

### **1. Initial Setup**
- [ ] Set up **Python** and **Flask** environment.
- [ ] Create the basic **Flask app** with a home page.
- [ ] Set up **SQLite database** with Flask-SQLAlchemy.
- [ ] Write **Podmanfile** for containerization.

**Estimated Completion Date:** [Date]

---

### **2. Frontend Design**
- [ ] Learn basic **HTML**, **CSS**, and **Jinja2 templating**.
- [ ] Design **basic UI** for tracking income and expenses.
- [ ] Implement **Bootstrap** for responsive design.
- [ ] Create a simple homepage with form inputs for transactions.
- [ ] Develop budget overview page with transaction summary.

**Estimated Completion Date:** [Date]

---

### **3. Authentication System**
- [ ] Research and select an **authentication method** (JWT or session-based).
- [ ] Implement **login page** and user authentication.
- [ ] Create **user registration** and password reset functionality.
- [ ] Integrate **Flask-JWT-Extended** or **Flask-Login** for secure user authentication.

**Estimated Completion Date:** [Date]

---

### **4. Database & Backend**
- [ ] Design **database schema** for transactions, budgets, and users.
- [ ] Implement **CRUD operations** for transactions (create, read, update, delete).
- [ ] Implement **budget setting** and tracking features.
- [ ] Add **data validation** and error handling.

**Estimated Completion Date:** [Date]

---

### **5. Security & Deployment**
- [ ] Implement **input validation** to prevent SQL injection and XSS.
- [ ] Set up **HTTPS** with SSL certificates (via Let’s Encrypt or similar).
- [ ] Test app with **authentication** and **CRUD operations**.
- [ ] Create **Podman container** for deployment.
- [ ] Deploy the app to a testing environment (Fly.io, Railway, etc.).

**Estimated Completion Date:** [Date]

---

### **6. Final Testing & Launch**
- [ ] Perform **end-to-end testing** of all features.
- [ ] Test **security** (authentication, input sanitization).
- [ ] Write basic **documentation** for app usage and setup.
- [ ] Finalize **Podman deployment**.
- [ ] Launch application and monitor for bugs/issues.

**Estimated Completion Date:** [Date]

---

## **Future Enhancements**
- Implement **graphs and reports** for income/expense analysis (using libraries like **Chart.js** or **D3.js**).
- Add **multi-user support** (if needed).
- Scale to **PostgreSQL** for future growth.
- Introduce **email notifications** for reminders or reports.

---

## **Issues/Notes**
- [ ] [Add any blockers, tasks, or areas that need additional research]
- [ ] [Link any helpful resources, tutorials, or documentation here]

---

## **Completed Tasks**
- [ ] Set up Flask environment.
- [ ] Designed basic UI and integrated Bootstrap.
- [ ] Implemented user authentication with JWT.
