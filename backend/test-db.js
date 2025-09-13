import { pool } from './db.js';  // ใช้ pool เดียวกับที่สร้างไว้
try {
  const [rows] = await pool.query('SELECT NOW() AS now');
  console.log('เชื่อมฐานข้อมูลสำเร็จ:', rows);
} catch (err) {
  console.error('เชื่อมไม่สำเร็จ:', err);
} finally {
  pool.end();
}
