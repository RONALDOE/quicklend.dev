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
  WORKING_TIME VARCHAR(512),
  STATUS ENUM("Activo", "Inactivo")DEFAULT 'Activo'
);

-- ... (Resto de la tabla Borrowers)
-- SELECT id,( select FULL_NAME  from Borrowers where Borrowers.id = Loans.borrower_id ) as borrowerName, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad, paymentsMade, loanStatus, remainingPayments
--   FROM Loans
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
  loanStatus ENUM('Pending', 'Rejected', 'Completed') DEFAULT 'Pending',
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
  montoAbonado DECIMAL(10, 2),  -- Nuevo campo para	 rastrear el monto abonado
  status ENUM('Pagado', 'No Pagado', 'Vencido', 'Abonado'),
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

CREATE TABLE Logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_type VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) -- Agrega esta línea para establecer una clave externa
);

SELECT *
FROM Loans
LEFT JOIN Borrowers ON Loans.borrower_id = Borrowers.id;


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
            WHERE loan_id = 2 AND status != 'Pagado';
            
			
DROP PROCEDURE IF EXISTS dashboard_stadictics;
DELIMITER //
CREATE PROCEDURE dashboard_stadictics()
BEGIN
    SELECT count(*) as noPagadosDia FROM payments where status !="Pagado" and fechaAPagar = CURDATE();
    SELECT count(*) as pagadosDia FROM payments where status ="Pagado" and fechaAPagar = CURDATE();
    SELECT count(*) as prestamosActivos FROM loans where loanstatus !="completo" ;
    SELECT sum(importeCredito) as totalPrestado FROM loans where loanstatus !="completo" ;
    Select count(*) as totalClientes from borrowers;
SELECT SUM(montoPagado) as gananciasDelMes FROM payments WHERE status = 'Pagado'
AND YEAR(fechaPago) = YEAR(CURRENT_DATE)
AND MONTH(fechaPago) = MONTH(CURRENT_DATE);

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

DELIMITER //
  
CREATE PROCEDURE AddLog(
    IN p_user_id INT,
    IN p_event_type VARCHAR(255),
    IN p_description TEXT
)
BEGIN
    INSERT INTO Logs (user_id, event_type, description)
    VALUES (p_user_id, p_event_type, p_description);
END //

DELIMITER ;

-- select * from loans ;

-- select * from payments where loan_id = 2
-- SELECT *
--         FROM Payments 
--         WHERE loan_id = 2
--         AND status != 'Pagado' 
--         ORDER BY cuotaNumero ASC 
--         LIMIT 1
-- 		
-- CALL dashboard_stadictics

INSERT INTO Users (username, email, psswd, admin_level) VALUES 
('rona', 'est.ronaldoernesto1@gmail.com', 'sisi', 1),
  ('Usuario 4', 'usuario4@example.com', 'contrasena4', 1),
  ('Usuario 5', 'usuario5@example.com', 'contrasena5', 1),
  ('Usuario 6', 'usuario6@example.com', 'contrasena6', 1),
  ('Usuario 7', 'usuario7@example.com', 'contrasena7', 1),
  ('Usuario 8', 'usuario8@example.com', 'contrasena8', 1),
  ('Usuario 9', 'usuario9@example.com', 'contrasena9', 1),
  ('Usuario 10', 'usuario10@example.com', 'contrasena10', 1),
  ('Usuario 11', 'usuario11@example.com', 'contrasena11', 1),
  ('Usuario 12', 'usuario12@example.com', 'contrasena12', 1),
  ('Usuario 13', 'usuario13@example.com', 'contrasena13', 1);

INSERT INTO Borrowers (FULL_NAME, IDENTIFICATION_NUMBER, PHONE, AGE, ADDRESS, WORKPLACE, WORKING_TIME) VALUES
  ('CARLOS GONZALEZ', '402-1234567-8', '809-123-4567', '35', 'Calle 123, Santo Domingo', 'ACME Corp', '1 año'),
  ('ANA MARIA PEREZ', '001-9876543-2', '809-987-6543', '28', 'Avenida Principal, Santiago', 'Tech Solutions', '2 años'),
  ('PEDRO RAMIREZ', '402-5555555-7', '809-555-5555', '40', 'Calle Principal, San Pedro', 'Globex Inc', '3 años'),
  ('JUAN LOPEZ', '001-8888888-4', '809-888-8888', '23', 'Calle Central, La Vega', 'Innovate Ltd', '1 año'),
  ('MARIA HERNANDEZ', '402-7777777-6', '809-777-7777', '29', 'Calle Secundaria, Santo Domingo', 'ABC Corporation', '2 años'),
  ('CAROLINA SANTANA', '001-6666666-5', '809-666-6666', '45', 'Avenida Principal, Santiago', 'EcoTech', '4 años'),
  ('DANIEL MARTINEZ', '402-4444444-3', '809-444-4444', '33', 'Calle Mayor, San Pedro', 'WebWizards', '2 años'),
  ('LAURA RODRIGUEZ', '001-2222222-1', '809-222-2222', '27', 'Calle Central, La Vega', 'Swift Systems', '1 año'),
  ('FERNANDO SANCHEZ', '402-9999999-9', '809-999-9999', '38', 'Avenida Principal, Santiago', 'DataMasters', '3 años'),
  ('MARTA JIMENEZ', '001-3333333-0', '809-333-3333', '31', 'Calle Principal, Santo Domingo', 'GlobalNet', '2 años');

INSERT INTO Loans (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad) VALUES
  (3, 1200.00, 'Mensual', 12.00, 6, 200.00, 1200.00, '2023-08-15', '1-6'),
  (6, 2500.00, 'Semanal', 20.00, 10, 250.00, 2500.00, '2023-08-20', '1-10'),
  (2, 1800.00, 'Quincenal', 15.00, 12, 150.00, 1800.00, '2023-08-10', '1-12'),
  (9, 3500.00, 'Diario', 30.00, 7, 500.00, 3500.00, '2023-08-05', '1-7'),
  (7, 900.00, 'Mensual', 10.00, 3, 300.00, 900.00, '2023-08-25', '1-3'),
  (1, 1500.00, 'Quincenal', 15.00, 6, 250.00, 1500.00, '2023-08-12', '1-6'),
  (5, 2800.00, 'Semanal', 18.00, 8, 350.00, 2800.00, '2023-08-18', '1-8'),
  (4, 2000.00, 'Diario', 25.00, 5, 400.00, 2000.00, '2023-08-08', '1-5'),
  (10, 3200.00, 'Mensual', 12.00, 9, 355.56, 3200.00, '2023-08-30', '1-9'),
  (8, 1100.00, 'Quincenal', 14.00, 4, 275.00, 1100.00, '2023-08-14', '1-4');



INSERT INTO LoansDrafts (borrower_id, importeCredito, modalidad, tasa, numCuotas, importeCuotas, totalAPagar, fecha, cuotasSegunModalidad) VALUES
  (3, 900.00, 'Mensual', 10.00, 6, 150.00, 900.00, '2023-09-01', '1-6'),
  (6, 1800.00, 'Semanal', 18.00, 10, 180.00, 1800.00, '2023-09-01', '1-10'),
  (2, 1200.00, 'Quincenal', 12.00, 12, 100.00, 1200.00, '2023-09-01', '1-12'),
  (9, 3000.00, 'Diario', 28.00, 7, 428.57, 3000.00, '2023-09-01', '1-7'),
  (7, 800.00, 'Mensual', 9.00, 3, 266.67, 800.00, '2023-09-01', '1-3'),
  (1, 1400.00, 'Quincenal', 14.00, 6, 233.33, 1400.00, '2023-09-01', '1-6'),
  (5, 2600.00, 'Semanal', 17.00, 8, 325.00, 2600.00, '2023-09-01', '1-8'),
  (4, 1900.00, 'Diario', 24.00, 5, 380.00, 1900.00, '2023-09-01', '1-5'),
  (10, 3100.00, 'Mensual', 11.00, 9, 344.44, 3100.00, '2023-09-01', '1-9'),
  (8, 1000.00, 'Quincenal', 13.00, 4, 250.00, 1000.00, '2023-09-01', '1-4');
INSERT INTO Payments (loan_id, cuotaNumero, fechaPago, montoPagado, montoAbonado, status, fechaAPagar) VALUES
  (3, 1, '2023-08-15', 150.00, 0.00, 'Pagado', '2023-08-01'),
  (6, 1, '2023-08-20', 180.00, 0.00, 'Pagado', '2023-08-20'),
  (2, 1, '2023-08-10', 150.00, 0.00, 'Pagado', '2023-08-10'),
  (9, 1, '2023-08-05', 428.57, 0.00, 'Pagado', '2023-08-05'),
  (7, 1, '2023-08-25', 266.67, 0.00, 'Pagado', '2023-08-25'),
  (1, 1, '2023-08-12', 250.00, 0.00, 'Pagado', '2023-08-12'),
  (5, 1, '2023-08-18', 325.00, 0.00, 'Pagado', '2023-08-18'),
  (4, 1, '2023-08-08', 380.00, 0.00, 'Pagado', '2023-08-08'),
  (10, 1, '2023-08-30', 344.44, 0.00, 'Pagado', '2023-08-30'),
  (8, 1, '2023-08-14', 250.00, 0.00, 'Pagado', '2023-08-14');

INSERT INTO Ranking (borrower_id, ranking_level, notes, activeLoans) VALUES
  (3, 4.2, 'Buen historial de pagos', 2),
  (6, 3.5, 'Pagos a tiempo', 3),
  (2, 4.8, 'Excelente cliente', 1),
  (9, 2.7, 'Algunos atrasos', 4),
  (7, 4.1, 'Pagos consistentes', 2),
  (1, 3.9, 'Historial mixto', 3),
  (5, 4.5, 'Buen historial de pagos', 1),
  (4, 3.2, 'Atrasos frecuentes', 5),
  (10, 4.0, 'Cliente confiable', 2),
  (8, 3.8, 'Historial mixto', 3);


	select * from payments left join loans on loans.id = payments.loan_id;
select * from payments