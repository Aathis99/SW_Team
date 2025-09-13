// server.js
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

/**
 * CORS
 * - ถ้าไม่มีการใช้ cookie/session ให้ใช้แบบ origin อย่างเดียว
 * - ถ้ามี cookie (เช่น login ด้วย session) ให้ใช้ credentials: true
 *   และต้องตั้ง fetch ฝั่งหน้าเว็บให้ { credentials: 'include' }
 */
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// ไม่มีคุกกี้/เซสชัน
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  })
);

// ถ้ามีคุกกี้ ให้ใช้บล็อกนี้แทนด้านบน (และคอมเมนต์บล็อกบนออก)
// app.use(
//   cors({
//     origin: FRONTEND_ORIGIN,
//     credentials: true,
//   })
// );

// ให้ Express อ่าน JSON
app.use(express.json());

// (ออปชัน) เฮลธ์เช็ค / ping DB ง่าย ๆ
app.get("/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ ok: true, db: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ ok: true, result: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/subject", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM subject");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/rooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// (ออปชัน) 404 สำหรับเส้นทางที่ไม่พบ
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`CORS allowed origin: ${FRONTEND_ORIGIN}`);
});
