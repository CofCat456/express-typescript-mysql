import { logger } from "@/server";
import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_js_test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = db.promise();

export const connect = async () => {
  try {
    await promisePool.query("SELECT 1");
    logger.info("成功連接到數據庫");

    await createUsersTable();
  } catch (error) {
    logger.error("無法連接到數據庫:", error);
    throw error;
  }
};

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      age INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    await promisePool.query(query);
    logger.info("users 表已成功創建或已存在");
  } catch (error) {
    logger.error("創建 users 表時出錯:", error);
    throw error;
  }
};

export default promisePool;
