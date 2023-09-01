DROP DATABASE IF EXISTS QUICKLEND;

CREATE DATABASE QUICKLEND;

USE QUICKLEND;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NULL,
  psswd VARCHAR(255) NOT NULL,
  admin_level INT NOT NULL DEFAULT 1
);

-- ... (Resto de la tabla Users)

CREATE TABLE Borrowers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  FULL_NAME VARCHAR(512),
  IDENTIFICATION_NUMBER VARCHAR(512),
  PHONE VARCHAR(512),
  AGE VARCHAR(512),
  ADDRESS VARCHAR(512),
  WORKPLACE VARCHAR(512),
  WORKING_TIME VARCHAR(512)
);

-- ... (Resto de la tabla Borrowers)

CREATE TABLE Loans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  borrower_id INT,
  importeCredito DECIMAL(10, 2),
  modalidad ENUM('Mensual', 'Semanal', 'Quincenal', 'Diario'),
  tasa DECIMAL(5, 2),
  numCuotas INT,
  importeCuotas DECIMAL(10, 2),
  totalAPagar DECIMAL(10, 2),
  fecha DATE,
  cuotasSegunModalidad VARCHAR(255),
  paymentsMade INT DEFAULT 0,
  loanStatus ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
  remainingPayments INT DEFAULT 0,
  FOREIGN KEY (borrower_id) REFERENCES Borrowers (id)
);

CREATE TABLE LoansDrafts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  borrower_id INT,
  importeCredito DECIMAL(10, 2),
  modalidad ENUM('Mensual', 'Semanal', 'Quincenal', 'Diario'),
  tasa DECIMAL(5, 2),
  numCuotas INT,
  importeCuotas DECIMAL(10, 2),
  totalAPagar DECIMAL(10, 2),
  fecha DATE,
  cuotasSegunModalidad VARCHAR(255),
  FOREIGN KEY (borrower_id) REFERENCES Borrowers (id)
);

CREATE TABLE Payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loan_id INT,
  cuotaNumero INT,
  fechaPago DATE NULL,
  montoPagado DECIMAL(10, 2),
  status ENUM('Pagado', 'No Pagado', 'Vencido'),
  fechaAPagar DATE,
  FOREIGN KEY (loan_id) REFERENCES Loans (id)
);


CREATE TABLE Ranking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  borrower_id INT,
  ranking_level DECIMAL(10, 2),
  notes VARCHAR(255),
  activeLoans INT DEFAULT 0,
  FOREIGN KEY (borrower_id) REFERENCES Borrowers (id)
);

CREATE TABLE globals(
secretPassword VARCHAR(255) NOT NULL);

insert into globals (secretPassword) values ("admin");
-- Inserts para la tabla Users
INSERT INTO Users (username, email, psswd, admin_level) VALUES
  ('admin', 'usuario1@example.com', 'admin', 1),
  ('Usuario 2', 'usuario2@example.com', 'contrasena2', 1),
  ('Usuario 3', 'usuario3@example.com', 'contrasena3', 1);

-- Inserts para la tabla Borrowers
INSERT INTO Borrowers (FULL_NAME, IDENTIFICATION_NUMBER, PHONE, AGE, ADDRESS, WORKPLACE, WORKING_TIME) VALUES
  ('LEANDRO TAVAREZ ABREU', '225-0041392-1', '849-642-1454', 'XX', 'SAN FELIPE DE VILLA MELLA', 'METRICAS SRL', '0,375'),
  ('LISBELY LARA ABAD', '402-1466800-2', '849-626-8724', 'XX', 'C/ PROLONGACION PRIMERA NO. 19. LOS FRAILES II', 'ZONA FRANCA POINT BLACK', '1 YEAR'),
  ('JOSE MARIA SANCHEZ', '001-1221092-7', '829-793-7209', '50', 'AV. LOPE DE VEGA NO. 121', 'HOSPITAL SOCORRO SANCHEZ', '0.041666667');
-- Inserts para la tabla Loans
INSERT INTO Loans (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad) VALUES
  (1, 1000.00, 'Mensual', 10.00, 12, 83.33, 1000.00, '2023-08-01', '1-12'),
  (2, 1500.00, 'Quincenal', 15.00, 24, 62.50, 1500.00, '2023-08-01', '1-24');
  -- ... (otros inserts aquí);

-- Inserts para la tabla LoansDrafts
INSERT INTO LoansDrafts (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad) VALUES
  (3, 800.00, 'Semanal', 20.00, 8, 100.00, 800.00, '2023-08-01', '1-8'),
  (1, 1200.00, 'Diario', 25.00, 30, 40.00, 1200.00, '2023-08-01', '1-30');


-- Inserts para la tabla Payments

  -- ... (otros inserts aquí);

-- Inserts para la tabla Ranking
INSERT INTO Ranking (borrower_id, ranking_level, notes) VALUES
  (1, 4.5, 'Buen historial de pagos'),
  (2, 2.7, 'Algunos atrasos en pagos');
  -- ... (otros inserts aquí);

INSERT INTO Payments (loan_id, cuotaNumero, fechaPago, montoPagado, status, fechaAPagar)
VALUES
  (1, 1, '2023-08-15', 83.33, 'Pagado', '2023-08-01'),
  (1, 2, '2023-09-15', 83.33, 'Pagado', '2023-09-01'),
  (2, 1, '2023-08-15', 62.50, 'No Pagado', '2023-08-01'),
  (2, 2, '2023-09-15', 62.50, 'Vencido', '2023-09-01');
SELECT SUM(montoPagado) AS totalDebt
            FROM Payments
            WHERE loan_id = 2 AND status != 'Pagado'
            
		

DELIMITER //
CREATE PROCEDURE dashboard_stadictics()
BEGIN
    SELECT count(*) as noPagadosDia FROM payments where status !="Pagado" and fechaAPagar = CURDATE();
    SELECT count(*) as pagadosDia FROM payments where status ="Pagado" and fechaAPagar = CURDATE();
    SELECT count(*) as prestamosActivos FROM loans where loanstatus !="completo" ;
    SELECT sum(importeCredito) as totalPrestado FROM loans where loanstatus !="completo" ;
    Select count(*) as totalClientes from borrowers;
SELECT SUM(montoPagado) as gananciasDelMes FROM payments WHERE status = 'Pagado'
AND YEAR(fechaAPagar) = YEAR(CURRENT_DATE)
AND MONTH(fechaAPagar) = MONTH(CURRENT_DATE);

SELECT DATE(fechaAPagar) as fecha,
       COUNT(*) as cantidad_pagos
FROM Payments
WHERE status = 'Pagado'
      AND fechaAPagar >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
GROUP BY fecha
ORDER BY fecha;

SELECT CASE
    WHEN DAYNAME(fecha) = 'Monday' THEN 'Lunes'
    WHEN DAYNAME(fecha) = 'Tuesday' THEN 'Martes'
    WHEN DAYNAME(fecha) = 'Wednesday' THEN 'Miércoles'
    WHEN DAYNAME(fecha) = 'Thursday' THEN 'Jueves'
    WHEN DAYNAME(fecha) = 'Friday' THEN 'Viernes'
    WHEN DAYNAME(fecha) = 'Saturday' THEN 'Sábado'
    WHEN DAYNAME(fecha) = 'Sunday' THEN 'Domingo'
    ELSE ''
END AS dia,
DATE(fecha) as fecha,
COUNT(*) as cantidad
FROM Loans
WHERE fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
GROUP BY dia, fecha
ORDER BY dia, fecha;



SELECT CASE
    WHEN DAYNAME(fechaAPagar) = 'Monday' THEN 'Lunes'
    WHEN DAYNAME(fechaAPagar) = 'Tuesday' THEN 'Martes'
    WHEN DAYNAME(fechaAPagar) = 'Wednesday' THEN 'Miércoles'
    WHEN DAYNAME(fechaAPagar) = 'Thursday' THEN 'Jueves'
    WHEN DAYNAME(fechaAPagar) = 'Friday' THEN 'Viernes'
    WHEN DAYNAME(fechaAPagar) = 'Saturday' THEN 'Sábado'
    WHEN DAYNAME(fechaAPagar) = 'Sunday' THEN 'Domingo'
    ELSE ''
END AS dia,
DATE(fechaAPagar) as fecha,
COUNT(*) as cantidad
FROM Payments
WHERE status = 'Pagado'
      AND fechaAPagar >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
GROUP BY dia, fecha
ORDER BY dia, fecha;

END //
DELIMITER ;


-- select * from loans ;
		

-- CALL dashboard_stadictics