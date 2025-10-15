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

// subjects from tb_subject (เพิ่ม ลบ รายวิชา)
app.get("/tb_subject", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tb_subject");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/tb_subject", async (req, res) => {
  try {
    const { subj_id, subj_name, subj_credit, subj_hourse } = req.body || {};

    // Basic validation
    if (
      !subj_id ||
      !subj_name ||
      subj_credit === undefined ||
      subj_hourse === undefined ||
      String(subj_id).trim() === "" ||
      String(subj_name).trim() === ""
    ) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing required fields" });
    }

    const creditNum = Number(subj_credit);
    const hoursNum = Number(subj_hourse);
    if (!Number.isFinite(creditNum) || !Number.isFinite(hoursNum)) {
      return res
        .status(400)
        .json({ ok: false, error: "subj_credit and subj_hourse must be numbers" });
    }

    const [result] = await pool.query(
      "INSERT INTO tb_subject (subj_id, subj_name, subj_credit, subj_hourse) VALUES (?, ?, ?, ?)",
      [subj_id, subj_name, creditNum, hoursNum]
    );

    res.status(201).json({
      ok: true,
      id: result.insertId,
      subj_id,
      subj_name,
      subj_credit: creditNum,
      subj_hourse: hoursNum,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete("/tb_subject/:subj_id", async (req, res) => {
  try {
    const subjId = Number(req.params.subj_id);
    if (!Number.isFinite(subjId)) {
      return res.status(400).json({ ok: false, error: "Invalid subj_id" });
    }
    const [result] = await pool.query("DELETE FROM tb_subject WHERE subj_id = ?", [subjId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: "tb_subject not found" });
    }
    res.json({ ok: true, subj_id: subjId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// rooms from tb_room (แสดงการใช้ห้องทั้งหมด)
app.get("/tb_room", async (req, res) => {
  try {
    let rows;
    try {
      [rows] = await pool.query("SELECT * FROM tb_room");
    } catch (err1) {
      try {
        [rows] = await pool.query("SELECT * FROM tb_room");
      } catch (err2) {
        return res.status(500).json({ ok: false, error: err2.message });
      }
    }
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// schedules from tb_schedule
app.get("/tb_schedule", async (req, res) => {
  try {
    const { term, date, startTime, endTime, room, subject } = req.query;

    // helper: HH:MM -> period (คาบ) โดยกำหนดคาบ1 = 08:00
    const toPeriod = (hhmm) => {
      if (!hhmm) return null;
      const [h, m] = String(hhmm).split(":").map(Number);
      const baseHour = 8; // คาบ1 = 08:00
      const hourOffset = h - baseHour + (m >= 30 ? 1 : 0); // ปัดขึ้นถ้า >=30 นาที
      return Math.max(1, Math.min(12, hourOffset + 1)); // กันค่าเลยเถิด
    };

    const pStart = toPeriod(startTime);
    const pEnd   = toPeriod(endTime);

    let sql = `
      SELECT
        s.scd_room,
        s.scd_day,
        s.scd_time_start,
        s.scd_time_end,
        s.scd_term,
        sub.subj_id,
        sub.subj_name
      FROM \`TB_Schedule\` s
      LEFT JOIN \`TB_Subject\` sub ON sub.subj_id = s.scd_subj
      WHERE 1=1
    `;
    const args = [];

    if (room)  { sql += " AND s.scd_room = ?"; args.push(Number(room)); }
    if (term)  { sql += " AND s.scd_term = ?"; args.push(term); }
    if (date)  { sql += " AND s.scd_day = ?";  args.push(date); } // ต้องส่ง 'Monday' แบบนี้มาจาก UI
    if (subject) {
      sql += " AND (sub.subj_name LIKE ? OR sub.subj_id LIKE ?)";
      args.push(`%${subject}%`, `%${subject}%`);
    }
    if (pStart != null) { sql += " AND s.scd_time_end   > ?"; args.push(pStart); }
    if (pEnd   != null) { sql += " AND s.scd_time_start < ?"; args.push(pEnd); }

    const [rows] = await pool.query(sql, args);

    // map period -> HH:MM (คาบ1=08:00)
    const toHH = (p) => {
      const hour = 7 + Number(p); // 1->8, 2->9 ...
      return String(hour).padStart(2, "0") + ":00";
    };

    const out = rows.map((r) => ({
      room: String(r.scd_room),
      // ส่งชื่อวันในสัปดาห์ไปก่อน (data model ปัจจุบันไม่มี date จริง)
      date: r.scd_day,
      start: toHH(r.scd_time_start),
      end: toHH(r.scd_time_end),
      subject: r.subj_name ?? String(r.subj_id ?? ""),
      term: r.scd_term,
    }));

    res.json(out);
  } catch (err) {
    console.error("GET /tb_schedule error:", err);
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
