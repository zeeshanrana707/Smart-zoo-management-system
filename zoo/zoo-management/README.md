# 🦁 Smart Zoo Management System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.3-green.svg)
![SQL Server](https://img.shields.io/badge/SQL%20Server-LocalDB-red.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**A comprehensive web-based zoo management system built with Flask and SQL Server**

[Features](#-features) • [Quick Start](#-quick-start) • [Database](#-database-schema) • [API](#-api-endpoints) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

</details>

---

## 🌟 Overview

The **Smart Zoo Management System** is a full-stack web application designed to help zoo administrators manage animals, staff, feeding schedules, medical records, and alerts efficiently. Built with Flask and SQL Server, it provides a clean, intuitive interface for all zoo operations.

### Why This Project?

- 🎯 **Real-world application** of database concepts (JOINs, GROUP BY, Views, Stored Procedures)
- 🔄 **Full CRUD operations** for all entities
- 📊 **Advanced SQL features** including views and stored procedures
- 🎨 **Modern UI** with responsive design
- 🚀 **RESTful API** architecture

---

## ✨ Features

<details open>
<summary><b>🐾 Animal Management</b></summary>

- Add, view, and delete animals
- Track animal age, species, and enclosure
- Sort animals by age
- Link animals to species and enclosures

</details>

<details open>
<summary><b>🧬 Species Management</b></summary>

- Manage different species
- Track diet types (Carnivore, Herbivore, Omnivore)
- View animal count per species (GROUP BY)

</details>

<details open>
<summary><b>👥 Staff Management</b></summary>

- Add and manage zoo staff
- Track roles and salaries
- View staff-enclosure assignments (Many-to-Many relationship)

</details>

<details open>
<summary><b>🍖 Feeding Schedule</b></summary>

- Create feeding schedules for animals
- Track food types and feeding times
- View complete feeding schedule

</details>

<details open>
<summary><b>🏥 Medical Records</b></summary>

- Maintain medical records for animals
- Track diagnoses and treatments
- Quick access to animal health history

</details>

<details open>
<summary><b>🚨 Alert System</b></summary>

- Create alerts for animals (Medical Emergency, Feeding Reminder, Transfer)
- View alerts using database VIEW
- Query alerts by animal using STORED PROCEDURE

</details>

<details open>
<summary><b>📊 Reports</b></summary>

- Animals per species (GROUP BY)
- Animals sorted by age (ORDER BY)
- Staff-enclosure assignments (JOIN)

</details>

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Python 3.8+, Flask 3.0.3 |
| **Database** | Microsoft SQL Server (LocalDB) |
| **Database Driver** | pyodbc 5.2.0 |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Architecture** | RESTful API, MVC Pattern |

---

## 🚀 Quick Start

<details open>
<summary><b>Prerequisites</b></summary>

Before you begin, ensure you have:

- ✅ Python 3.8 or higher
- ✅ Microsoft SQL Server (LocalDB or Express)
- ✅ SQL Server Management Studio (SSMS) - optional but recommended
- ✅ ODBC Driver for SQL Server

</details>

### Step 1️⃣: Clone the Repository

```bash
git clone <repository-url>
cd smart-zoo-management
```

### Step 2️⃣: Install Dependencies

```bash
pip install -r requirements.txt
```

<details>
<summary>📦 What gets installed?</summary>

- `flask==3.0.3` - Web framework
- `pyodbc==5.2.0` - SQL Server database driver

</details>

### Step 3️⃣: Set Up the Database

<details open>
<summary><b>Option A: Using SSMS (Recommended)</b></summary>

1. Open **SQL Server Management Studio**
2. Connect to your SQL Server instance
3. Open `database/schema.sql`
4. Execute the script (F5)
5. Verify the `ZooDB` database was created

</details>

<details>
<summary><b>Option B: Using Command Line</b></summary>

```bash
sqlcmd -S (localdb)\MSSQLLocalDB -i database/schema.sql
```

</details>

### Step 4️⃣: Configure Database Connection

Open `app.py` and update the `SERVER_NAME` variable:

```python
# Find your server name in SSMS login dialog
# Examples: DESKTOP-ABC\SQLEXPRESS, DELL\SQLEXPRESS, (localdb)\MSSQLLocalDB
SERVER_NAME = "(localdb)\MSSQLLocalDB"  # ← Update this
```

<details>
<summary>🔍 How to find your server name?</summary>

1. Open SQL Server Management Studio
2. Look at the "Connect to Server" dialog
3. Copy the "Server name" value
4. Paste it into `app.py`

</details>

### Step 5️⃣: Run the Application

```bash
python app.py
```

The application will start at **http://127.0.0.1:5000**

<details>
<summary>✅ Expected output</summary>

```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

</details>

### Step 6️⃣: Open in Browser

Navigate to **http://localhost:5000** and start managing your zoo! 🎉

---

## 🗄️ Database Schema

<details open>
<summary><b>Entity Relationship Diagram</b></summary>

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Species   │       │   Animals    │       │ Enclosures  │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ Species_ID  │◄──────│ Animal_ID    │──────►│Enclosure_ID │
│ Species_Name│       │ Name         │       │ Type        │
│ Diet_Type   │       │ Age          │       │ Capacity    │
└─────────────┘       │ Species_ID   │       └─────────────┘
                      │ Enclosure_ID │              ▲
                      └──────────────┘              │
                             ▲                      │
                             │                      │
                    ┌────────┴────────┐    ┌────────┴────────┐
                    │                 │    │                 │
              ┌─────────┐      ┌──────────┐      ┌──────────────────┐
              │ Feeding │      │ Medical  │      │ Staff_Enclosure  │
              ├─────────┤      │ Records  │      ├──────────────────┤
              │Feeding_ID│      │Record_ID │      │ Staff_ID         │
              │Animal_ID│      │Animal_ID │      │ Enclosure_ID     │
              │Food_Type│      │Diagnosis │      └──────────────────┘
              │Time     │      │Treatment │               ▲
              └─────────┘      └──────────┘               │
                                                    ┌──────────┐
              ┌─────────┐                           │  Staff   │
              │ Alerts  │                           ├──────────┤
              │Alert_ID │                           │Staff_ID  │
              │Animal_ID│                           │Name      │
              │AlertType│                           │Role      │
              │AlertDate│                           │Salary    │
              └─────────┘                           └──────────┘
```

</details>

<details>
<summary><b>📊 Tables Overview</b></summary>

| Table | Description | Key Features |
|-------|-------------|--------------|
| **Species** | Animal species catalog | Diet types (Carnivore, Herbivore, Omnivore) |
| **Enclosures** | Zoo enclosures | Type and capacity tracking |
| **Animals** | Individual animals | Links to species and enclosures |
| **Staff** | Zoo employees | Roles and salary information |
| **Feeding** | Feeding schedules | Time-based feeding records |
| **Medical_Records** | Animal health records | Diagnosis and treatment tracking |
| **Alerts** | System alerts | Medical, feeding, and transfer alerts |
| **Staff_Enclosure** | Staff assignments | Many-to-many relationship |

</details>

<details>
<summary><b>🔍 Advanced SQL Features</b></summary>

### View: `AnimalAlertView`
Combines animal names with alert information for easy querying.

```sql
CREATE VIEW AnimalAlertView AS
SELECT Animals.Name AS AnimalName,
       Alerts.Alert_Type AS AlertType,
       Alerts.Alert_Date AS AlertDate
FROM Alerts
JOIN Animals ON Alerts.Animal_ID = Animals.Animal_ID;
```

### Stored Procedure: `GetAnimalAlerts`
Retrieves all alerts for a specific animal.

```sql
CREATE PROCEDURE GetAnimalAlerts @AnimalID INT
AS
BEGIN
    SELECT * FROM Alerts WHERE Animal_ID = @AnimalID;
END;
```

</details>

---

## 🔌 API Endpoints

<details open>
<summary><b>🐾 Animals</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/animals` | Get all animals with species and enclosure info |
| `POST` | `/api/animals` | Add a new animal |
| `DELETE` | `/api/animals/<id>` | Delete an animal |

**Example Request:**
```json
POST /api/animals
{
  "name": "Leo",
  "age": 5,
  "species_id": 1,
  "enclosure_id": 1
}
```

</details>

<details>
<summary><b>🧬 Species</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/species` | Get all species |
| `POST` | `/api/species` | Add a new species |

</details>

<details>
<summary><b>👥 Staff</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/staff` | Get all staff members |
| `POST` | `/api/staff` | Add a new staff member |
| `GET` | `/api/staff-enclosures` | Get staff-enclosure assignments (JOIN) |

</details>

<details>
<summary><b>🍖 Feeding</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/feeding` | Get all feeding schedules |
| `POST` | `/api/feeding` | Add a feeding schedule |

</details>

<details>
<summary><b>🏥 Medical</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/medical` | Get all medical records |
| `POST` | `/api/medical` | Add a medical record |

</details>

<details>
<summary><b>🚨 Alerts</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/alerts` | Get all alerts (uses VIEW) |
| `GET` | `/api/alerts/animal/<id>` | Get alerts for specific animal (uses STORED PROCEDURE) |
| `POST` | `/api/alerts` | Add a new alert |

</details>

<details>
<summary><b>📊 Reports</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/animals-per-species` | Get animal count per species (GROUP BY) |
| `GET` | `/api/enclosures` | Get all enclosures |

</details>

---

## 📁 Project Structure

```
smart-zoo-management/
│
├── 📄 app.py                    # Flask application & API routes
├── 📄 requirements.txt          # Python dependencies
├── 📄 README.md                 # This file
│
├── 📁 database/
│   └── 📄 schema.sql            # Database schema & sample data
│
├── 📁 templates/
│   └── 📄 index.html            # Main HTML page
│
└── 📁 static/
    ├── 📄 style.css             # Styling
    └── 📄 script.js             # Frontend JavaScript
```

---

## ⚙️ Configuration

<details>
<summary><b>Database Connection Settings</b></summary>

Edit `app.py` to configure your database connection:

```python
SERVER_NAME = "(localdb)\MSSQLLocalDB"  # Your SQL Server instance

def get_connection():
    drivers = [
        "{ODBC Driver 17 for SQL Server}",
        "{ODBC Driver 13 for SQL Server}",
        "{SQL Server}",
    ]
    # Automatically tries multiple drivers
```

</details>

<details>
<summary><b>Flask Settings</b></summary>

```python
if __name__ == "__main__":
    app.run(
        debug=True,      # Enable debug mode
        host='0.0.0.0',  # Allow external connections
        port=5000        # Port number
    )
```

</details>

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ "Could not connect to SQL Server"</b></summary>

**Solution:**
1. Verify SQL Server is running
2. Check your `SERVER_NAME` in `app.py`
3. Ensure the database `ZooDB` exists
4. Install ODBC Driver: [Download here](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)

</details>

<details>
<summary><b>❌ "No module named 'flask'"</b></summary>

**Solution:**
```bash
pip install -r requirements.txt
```

</details>

<details>
<summary><b>❌ "Database 'ZooDB' does not exist"</b></summary>

**Solution:**
Run the database schema script:
```bash
sqlcmd -S (localdb)\MSSQLLocalDB -i database/schema.sql
```

</details>

<details>
<summary><b>❌ Port 5000 already in use</b></summary>

**Solution:**
Change the port in `app.py`:
```python
app.run(debug=True, port=5001)  # Use a different port
```

</details>

---

## 🎯 Learning Outcomes

This project demonstrates:

- ✅ **SQL Fundamentals**: CREATE, INSERT, SELECT, UPDATE, DELETE
- ✅ **Advanced SQL**: JOINs, GROUP BY, ORDER BY, Views, Stored Procedures
- ✅ **Database Design**: Foreign keys, relationships, normalization
- ✅ **Backend Development**: Flask, RESTful APIs, routing
- ✅ **Frontend Development**: DOM manipulation, fetch API, dynamic UI
- ✅ **Full-Stack Integration**: Client-server communication

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

Created with ❤️ by Muhammad Zeeshan Team

---

## 🙏 Acknowledgments

- Flask documentation
- Microsoft SQL Server documentation
- All contributors and testers

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**[Back to Top](#-smart-zoo-management-system)**

</div>
