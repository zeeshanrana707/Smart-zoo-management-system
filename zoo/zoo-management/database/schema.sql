-- =============================================
-- Smart Zoo Management System - Schema
-- =============================================

CREATE DATABASE ZooDB;
GO

USE ZooDB;
GO

-- 1. Species Table
CREATE TABLE Species (
    Species_ID   INT PRIMARY KEY IDENTITY(1,1),
    Species_Name VARCHAR(100) NOT NULL,
    Diet_Type    VARCHAR(50)  NOT NULL
);

-- 2. Enclosures Table
CREATE TABLE Enclosures (
    Enclosure_ID INT PRIMARY KEY IDENTITY(1,1),
    Type         VARCHAR(100) NOT NULL,
    Capacity     INT          NOT NULL
);

-- 3. Animals Table
CREATE TABLE Animals (
    Animal_ID    INT PRIMARY KEY IDENTITY(1,1),
    Name         VARCHAR(100) NOT NULL,
    Age          INT          NOT NULL,
    Species_ID   INT FOREIGN KEY REFERENCES Species(Species_ID),
    Enclosure_ID INT FOREIGN KEY REFERENCES Enclosures(Enclosure_ID)
);

-- 4. Staff Table
CREATE TABLE Staff (
    Staff_ID INT PRIMARY KEY IDENTITY(1,1),
    Name     VARCHAR(100)   NOT NULL,
    Role     VARCHAR(100)   NOT NULL,
    Salary   DECIMAL(10, 2) NOT NULL
);

-- 5. Feeding Table
CREATE TABLE Feeding (
    Feeding_ID INT PRIMARY KEY IDENTITY(1,1),
    Animal_ID  INT          FOREIGN KEY REFERENCES Animals(Animal_ID),
    Food_Type  VARCHAR(100) NOT NULL,
    Time       TIME         NOT NULL
);

-- 6. Medical Records Table
CREATE TABLE Medical_Records (
    Record_ID  INT PRIMARY KEY IDENTITY(1,1),
    Animal_ID  INT          FOREIGN KEY REFERENCES Animals(Animal_ID),
    Diagnosis  VARCHAR(255) NOT NULL,
    Treatment  VARCHAR(255) NOT NULL
);

-- 7. Alerts Table
CREATE TABLE Alerts (
    Alert_ID   INT PRIMARY KEY IDENTITY(1,1),
    Animal_ID  INT          FOREIGN KEY REFERENCES Animals(Animal_ID),
    Alert_Type VARCHAR(100) NOT NULL,
    Alert_Date DATE         NOT NULL
);

-- 8. Staff_Enclosure Table (Many-to-Many)
CREATE TABLE Staff_Enclosure (
    Staff_ID     INT FOREIGN KEY REFERENCES Staff(Staff_ID),
    Enclosure_ID INT FOREIGN KEY REFERENCES Enclosures(Enclosure_ID),
    PRIMARY KEY (Staff_ID, Enclosure_ID)
);

GO

-- =============================================
-- VIEW: AnimalAlertView
-- =============================================
CREATE VIEW AnimalAlertView AS
SELECT
    Animals.Name      AS AnimalName,
    Alerts.Alert_Type AS AlertType,
    Alerts.Alert_Date AS AlertDate
FROM Alerts
JOIN Animals ON Alerts.Animal_ID = Animals.Animal_ID;

GO

-- =============================================
-- STORED PROCEDURE: GetAnimalAlerts
-- =============================================
CREATE PROCEDURE GetAnimalAlerts
    @AnimalID INT
AS
BEGIN
    SELECT * FROM Alerts
    WHERE Animal_ID = @AnimalID;
END;

GO

-- =============================================
-- SAMPLE DATA
-- =============================================

INSERT INTO Species (Species_Name, Diet_Type) VALUES
('Lion',     'Carnivore'),
('Elephant', 'Herbivore'),
('Penguin',  'Carnivore'),
('Giraffe',  'Herbivore'),
('Monkey',   'Omnivore');

INSERT INTO Enclosures (Type, Capacity) VALUES
('Savanna',  10),
('Jungle',   15),
('Arctic',   8),
('Open Field', 20);

INSERT INTO Animals (Name, Age, Species_ID, Enclosure_ID) VALUES
('Simba',   5,  1, 1),
('Dumbo',   12, 2, 4),
('Pingu',   3,  3, 3),
('Gerald',  7,  4, 4),
('Charlie', 4,  5, 2);

INSERT INTO Staff (Name, Role, Salary) VALUES
('Farhan',   'Zookeeper',    45000),
('Riyan',     'Veterinarian', 70000),
('Kamran',   'Zookeeper',    44000),
('Zeeshan',   'Manager',      85000);

INSERT INTO Feeding (Animal_ID, Food_Type, Time) VALUES
(1, 'Meat',   '08:00:00'),
(2, 'Grass',  '09:00:00'),
(3, 'Fish',   '10:00:00'),
(4, 'Leaves', '08:30:00'),
(5, 'Fruits', '11:00:00');

INSERT INTO Medical_Records (Animal_ID, Diagnosis, Treatment) VALUES
(1, 'Fever',       'Antibiotics'),
(3, 'Wing Injury', 'Bandaging'),
(5, 'Stomach Ache','Medication');

INSERT INTO Alerts (Animal_ID, Alert_Type, Alert_Date) VALUES
(1, 'Medical Emergency', '2026-04-28'),
(2, 'Feeding Reminder',  '2026-04-29'),
(3, 'Animal Transfer',   '2026-04-30'),
(5, 'Medical Emergency', '2026-05-01');

INSERT INTO Staff_Enclosure (Staff_ID, Enclosure_ID) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 1);
