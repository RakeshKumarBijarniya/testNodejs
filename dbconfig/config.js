const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sikar@123",
  database: "newUserDatabase",
});

// connection.query(
//   `CREATE DATABASE IF NOT EXISTS newUserDatabase`,
//   (err, result) => {
//     if (err) {
//       console.log("Error is found", err.code);
//     } else {
//       console.log("Create Database Successfully");
//     }
//   }
// );

// const createTables = () => {
//   const queries = [
//     // Users table
//     `CREATE TABLE IF NOT EXISTS users (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(100),
//         email VARCHAR(200) UNIQUE,
//         password_hash VARCHAR(255),
//         role VARCHAR(50)
//       );`,

//     // Projects table
//     `CREATE TABLE IF NOT EXISTS projects (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(200),
//         description TEXT,
//         created_by INT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (created_by) REFERENCES users(id)
//       );`,

//     // Tasks table
//     `CREATE TABLE IF NOT EXISTS tasks (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         title VARCHAR(200),
//         project_id INT,
//         assigned_to INT,
//         status VARCHAR(50),
//         due_date DATE,
//         priority VARCHAR(50),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//         FOREIGN KEY (project_id) REFERENCES projects(id),
//         FOREIGN KEY (assigned_to) REFERENCES users(id)
//       );`,

//     // Comments table
//     `CREATE TABLE IF NOT EXISTS comments (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         task_id INT,
//         user_id INT,
//         comment_text TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (task_id) REFERENCES tasks(id),
//         FOREIGN KEY (user_id) REFERENCES users(id)
//       );`,

//     // Activity Logs table
//     `CREATE TABLE IF NOT EXISTS activity_logs (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT,
//         action VARCHAR(255),
//         task_id INT,
//         timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (user_id) REFERENCES users(id),
//         FOREIGN KEY (task_id) REFERENCES tasks(id)
//       );`,
//   ];

//   queries.forEach((query, index) => {
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error(`❌ Error creating table ${index + 1}:`, err.message);
//       } else {
//         console.log(`✅ Table ${index + 1} created or already exists.`);
//       }
//     });
//   });
// };

// createTables();
module.exports = connection;
