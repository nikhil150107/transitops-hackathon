# 🚛 TransitOps — Smart Transport Operations Platform

TransitOps is a centralized platform for managing the complete lifecycle of transport
operations — vehicle registration, driver management, trip dispatching, maintenance,
fuel/expense tracking, and operational analytics. Built to replace spreadsheet-driven
fleet management with a single, rule-enforced source of truth.

Built as part of the **Odoo Hackathon** (8-hour build).

---

## 📌 Problem Statement

Many logistics companies still run their transport operations on spreadsheets and
manual logbooks — leading to scheduling conflicts, underutilized vehicles, missed
maintenance, expired driver licenses, inaccurate expense tracking, and poor
visibility into fleet performance.

**TransitOps** solves this by digitizing the entire workflow: register vehicles and
drivers, dispatch trips with automatic validation, log maintenance and fuel, and get
real-time KPIs and analytics — all with role-based access control.

---

## 👥 Target Users

| Role | Responsibilities |
|---|---|
| **Fleet Manager** | Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency |
| **Driver** | Creates trips, assigns vehicles/drivers, monitors active deliveries |
| **Safety Officer** | Ensures driver compliance, tracks license validity, monitors safety scores |
| **Financial Analyst** | Reviews expenses, fuel consumption, maintenance costs, and profitability |

---

## ✨ Core Features

- 🔐 **Authentication & RBAC** — secure email/password login, role-based access
- 📊 **Dashboard** — Active/Available Vehicles, Vehicles in Maintenance, Active/Pending
  Trips, Drivers on Duty, Fleet Utilization (%), with filters by type/status/region
- 🚚 **Vehicle Registry** — unique registration numbers, load capacity, odometer,
  acquisition cost, and status tracking (Available / On Trip / In Shop / Retired)
- 🧑‍✈️ **Driver Management** — license category & expiry tracking, safety score,
  status tracking (Available / On Trip / Off Duty / Suspended)
- 🗺️ **Trip Management** — Draft → Dispatched → Completed → Cancelled lifecycle with
  full business-rule validation
- 🛠️ **Maintenance Workflow** — logging a maintenance record automatically pulls a
  vehicle out of the dispatch pool
- ⛽ **Fuel & Expense Tracking** — logs, automatic cost roll-ups per vehicle
- 📈 **Reports & Analytics** — Fuel Efficiency, Fleet Utilization, Operational Cost,
  Vehicle ROI, CSV export
- 🤖 **AI Service** — Groq-powered incident classification, severity prediction, and
  resource recommendation, exposed as an independent FastAPI microservice

---

## 🧠 Mandatory Business Rules

- Vehicle registration numbers must be unique
- Retired or In Shop vehicles never appear in the dispatch pool
- Drivers with expired licenses or Suspended status cannot be assigned to trips
- A vehicle/driver already On Trip cannot be assigned to another trip
- Cargo weight must not exceed the vehicle's maximum load capacity
- Dispatching a trip → vehicle & driver auto-switch to **On Trip**
- Completing a trip → vehicle & driver auto-switch back to **Available**
- Cancelling a dispatched trip → vehicle & driver restored to **Available**
- Creating an active maintenance record → vehicle auto-switches to **In Shop**
- Closing maintenance → vehicle restored to **Available** (unless retired)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React |
| **Backend** | Spring Boot 3.5.x (Java 21/17), Spring Web, Spring Data JPA, Spring Security, Lombok, Validation |
| **AI Service** | Python, FastAPI |
| **Database** | MySQL |
| **Build Tools** | Maven (`mvnw`), Vite |

---

## 📁 Repository Structure

```
TransitOps/
├── app/                # React frontend
├── src/                # Spring Boot backend source (com.transitops)
├── ai-service/         # Python FastAPI AI microservice
├── .mvn/wrapper/        # Maven wrapper
├── pom.xml              # Backend Maven config
├── requirements.txt     # AI service Python dependencies
└── .env.example          # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+ and Maven
- Node.js and npm
- Python 3.10+
- MySQL

### 1. Clone the repo
```bash
git clone https://github.com/nikhil150107/transitops-hackathon.git
cd transitops-hackathon
```

### 2. Backend (Spring Boot)
```bash
cp .env.example .env   # fill in DB credentials, Groq API key, etc.
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080` by default.

### 3. AI Service (FastAPI)
```bash
cd ai-service
pip install -r ../requirements.txt
uvicorn main:app --reload
```

### 4. Frontend (React)
```bash
cd app
npm install
npm run dev
```

---

## 🗄️ Database

Create a MySQL database (e.g. `transitops`) and update the connection details in
your `.env` file / `application.properties`. Core entities: `Users`, `Roles`,
`Vehicles`, `Drivers`, `Trips`, `MaintenanceLogs`, `FuelLogs`, `Expenses`.

---

## 🧩 Example Workflow

1. Register vehicle `Van-05` (max capacity 500 kg) → status `Available`
2. Register driver `Alex` with a valid license
3. Create a trip with cargo weight `450 kg` → validated against capacity
4. Dispatch trip → vehicle & driver auto-switch to `On Trip`
5. Complete trip (enter final odometer + fuel consumed) → both revert to `Available`
6. Log a maintenance record (e.g. Oil Change) → vehicle auto-switches to `In Shop`
   and disappears from dispatch
7. Reports update fuel efficiency and operational cost automatically

---

## 👨‍💻 Team

| Member | Role |
|---|---|
| **Nikhil/Bavesh** | AI & Integration — route optimization, mock data, map integration, frontend↔backend wiring |
| **Om** | Frontend — React UI, live map, dashboards, alerts |
| **Pankaj ** | Backend — APIs, auth, incident management, database integration |

---

## 📄 License

Built for hackathon purposes. No license specified.
