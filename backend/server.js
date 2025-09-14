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


app.get("/subject", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM subject");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/subject", async (req, res) => {
  try {
    const { subj_id, subj_name, subj_credit, subj_hours } = req.body || {};

    // Basic validation
    if (
      !subj_id ||
      !subj_name ||
      subj_credit === undefined ||
      subj_hours === undefined ||
      String(subj_id).trim() === "" ||
      String(subj_name).trim() === ""
    ) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing required fields" });
    }

    const creditNum = Number(subj_credit);
    const hoursNum = Number(subj_hours);
    if (!Number.isFinite(creditNum) || !Number.isFinite(hoursNum)) {
      return res
        .status(400)
        .json({ ok: false, error: "subj_credit and subj_hours must be numbers" });
    }

    const [result] = await pool.query(
      "INSERT INTO subject (subj_id, subj_name, subj_credit, subj_hours) VALUES (?, ?, ?, ?)",
      [subj_id, subj_name, creditNum, hoursNum]
    );

    res.status(201).json({
      ok: true,
      id: result.insertId,
      subj_id,
      subj_name,
      subj_credit: creditNum,
      subj_hours: hoursNum,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete("/subject/:subj_id", async (req, res) => {
  try {
    const subjId = Number(req.params.subj_id);
    if (!Number.isFinite(subjId)) {
      return res.status(400).json({ ok: false, error: "Invalid subj_id" });
    }
    const [result] = await pool.query("DELETE FROM subject WHERE subj_id = ?", [subjId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: "Subject not found" });
    }
    res.json({ ok: true, subj_id: subjId });
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
