from flask import Flask, render_template, request, jsonify
import pyodbc

app = Flask(__name__)

# ── DB Connection ──────────────────────────────────────────────
# UPDATE THIS to match your SQL Server instance name
# Find it in SSMS login dialog, e.g. DESKTOP-ABC\SQLEXPRESS or DELL\SQLEXPRESS
SERVER_NAME = "(localdb)\MSSQLLocalDB"

def get_connection():
    # Tries multiple drivers automatically
    drivers = [
        "{ODBC Driver 17 for SQL Server}",
        "{ODBC Driver 13 for SQL Server}",
        "{SQL Server}",
    ]
    last_err = None
    for driver in drivers:
        try:
            conn = pyodbc.connect(
                f"DRIVER={driver};"
                f"SERVER={SERVER_NAME};"
                "DATABASE=ZooDB;"
                "Trusted_Connection=yes;"
            )
            return conn
        except pyodbc.Error as e:
            last_err = e
            continue
    raise Exception(
        f"Could not connect to SQL Server '{SERVER_NAME}'. "
        f"Open app.py and update SERVER_NAME to your actual server name shown in SSMS."
    )


def query(sql, params=(), fetchone=False):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql, params)
    if fetchone:
        row = cursor.fetchone()
        conn.close()
        return row
    rows = cursor.fetchall()
    cols = [col[0] for col in cursor.description]
    conn.close()
    return [dict(zip(cols, row)) for row in rows]


def execute(sql, params=()):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql, params)
    conn.commit()
    conn.close()


# ── Pages ──────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


# ── Animals ───────────────────────────────────────────────────
@app.route("/api/animals")
def get_animals():
    rows = query("""
        SELECT a.Animal_ID, a.Name, a.Age,
               s.Species_Name, e.Type AS Enclosure
        FROM Animals a
        JOIN Species    s ON a.Species_ID   = s.Species_ID
        JOIN Enclosures e ON a.Enclosure_ID = e.Enclosure_ID
        ORDER BY a.Age ASC
    """)
    return jsonify(rows)


@app.route("/api/animals", methods=["POST"])
def add_animal():
    d = request.json
    execute(
        "INSERT INTO Animals (Name, Age, Species_ID, Enclosure_ID) VALUES (?,?,?,?)",
        (d["name"], d["age"], d["species_id"], d["enclosure_id"])
    )
    return jsonify({"message": "Animal added"})


@app.route("/api/animals/<int:aid>", methods=["DELETE"])
def delete_animal(aid):
    execute("DELETE FROM Animals WHERE Animal_ID=?", (aid,))
    return jsonify({"message": "Animal deleted"})


# ── Species ───────────────────────────────────────────────────
@app.route("/api/species")
def get_species():
    return jsonify(query("SELECT * FROM Species"))


@app.route("/api/species", methods=["POST"])
def add_species():
    d = request.json
    execute(
        "INSERT INTO Species (Species_Name, Diet_Type) VALUES (?,?)",
        (d["species_name"], d["diet_type"])
    )
    return jsonify({"message": "Species added"})


# ── Animals per Species (GROUP BY) ────────────────────────────
@app.route("/api/animals-per-species")
def animals_per_species():
    rows = query("""
        SELECT s.Species_Name, COUNT(*) AS TotalAnimals
        FROM Animals a
        JOIN Species s ON a.Species_ID = s.Species_ID
        GROUP BY s.Species_Name
    """)
    return jsonify(rows)


# ── Staff ─────────────────────────────────────────────────────
@app.route("/api/staff")
def get_staff():
    return jsonify(query("SELECT * FROM Staff"))


@app.route("/api/staff", methods=["POST"])
def add_staff():
    d = request.json
    execute(
        "INSERT INTO Staff (Name, Role, Salary) VALUES (?,?,?)",
        (d["name"], d["role"], d["salary"])
    )
    return jsonify({"message": "Staff added"})


# ── Staff + Enclosures (JOIN) ─────────────────────────────────
@app.route("/api/staff-enclosures")
def staff_enclosures():
    rows = query("""
        SELECT st.Name AS StaffName, st.Role, e.Type AS Enclosure
        FROM Staff st
        JOIN Staff_Enclosure se ON st.Staff_ID     = se.Staff_ID
        JOIN Enclosures      e  ON se.Enclosure_ID = e.Enclosure_ID
    """)
    return jsonify(rows)


# ── Enclosures ────────────────────────────────────────────────
@app.route("/api/enclosures")
def get_enclosures():
    return jsonify(query("SELECT * FROM Enclosures"))


# ── Feeding ───────────────────────────────────────────────────
@app.route("/api/feeding")
def get_feeding():
    rows = query("""
        SELECT f.Feeding_ID, a.Name AS Animal, f.Food_Type,
               CONVERT(VARCHAR(5), f.Time, 108) AS Time
        FROM Feeding f
        JOIN Animals a ON f.Animal_ID = a.Animal_ID
    """)
    return jsonify(rows)


@app.route("/api/feeding", methods=["POST"])
def add_feeding():
    d = request.json
    execute(
        "INSERT INTO Feeding (Animal_ID, Food_Type, Time) VALUES (?,?,?)",
        (d["animal_id"], d["food_type"], d["time"])
    )
    return jsonify({"message": "Feeding record added"})


# ── Medical Records ───────────────────────────────────────────
@app.route("/api/medical")
def get_medical():
    rows = query("""
        SELECT m.Record_ID, a.Name AS Animal, m.Diagnosis, m.Treatment
        FROM Medical_Records m
        JOIN Animals a ON m.Animal_ID = a.Animal_ID
    """)
    return jsonify(rows)


@app.route("/api/medical", methods=["POST"])
def add_medical():
    d = request.json
    execute(
        "INSERT INTO Medical_Records (Animal_ID, Diagnosis, Treatment) VALUES (?,?,?)",
        (d["animal_id"], d["diagnosis"], d["treatment"])
    )
    return jsonify({"message": "Medical record added"})


# ── Alerts (View + Stored Procedure) ─────────────────────────
@app.route("/api/alerts")
def get_alerts():
    return jsonify(query(
        "SELECT * FROM AnimalAlertView ORDER BY AlertDate DESC"
    ))


@app.route("/api/alerts/animal/<int:aid>")
def alerts_by_animal(aid):
    rows = query(
        "EXEC GetAnimalAlerts ?", (aid,)
    )
    return jsonify(rows)


@app.route("/api/alerts", methods=["POST"])
def add_alert():
    d = request.json
    execute(
        "INSERT INTO Alerts (Animal_ID, Alert_Type, Alert_Date) VALUES (?,?,?)",
        (d["animal_id"], d["alert_type"], d["alert_date"])
    )
    return jsonify({"message": "Alert added"})


if __name__ == "__main__":
    app.run(debug=True)
