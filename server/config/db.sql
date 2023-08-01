DROP DATABASE IF EXISTS QUICKLEND;

CREATE DATABASE QUICKLEND;

USE QUICKLEND;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NULL,
  psswd VARCHAR(255) NOT NULL,
  admin_level INT NOT NULL default(1)		
);
INSERT INTO Users (username, email, psswd) VALUES
  ('admin', 'usuario1@example.com', 'admin'),
  ('Usuario 2', 'usuario2@example.com', 'contrasena2'),
  ('Usuario 3', 'usuario3@example.com', 'contrasena3');
  
CREATE TABLE borrowers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  id_number VARCHAR(20) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  age INT NOT NULL,
  address VARCHAR(100) NOT NULL,
  work_place VARCHAR(100) NOT NULL,
  working_time VARCHAR(50) NOT NULL
);	  
  INSERT INTO borrowers (name, lastname, id_number, phone_number, age, address, work_place, working_time) VALUES
  ('Juan', 'Pérez', '1234567890', '555-1234', 35, 'Calle Principal 123', 'Empresa A', '5 años'),
  ('María', 'Gómez', '0987654321', '555-5678', 28, 'Avenida Central 456', 'Empresa B', '3 años'),
  ('Carlos', 'López', '9876543210', '555-9876', 42, 'Carrera 10 789', 'Empresa C', '8 años');

