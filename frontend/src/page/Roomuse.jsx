import React, { useEffect, useMemo, useState } from "react";

/**
 * Room Availability Page â€“ React + TailwindCSS + DaisyUI
 * Pulls data from backend tables: rooms, tb_schedule
 */

// API base URL (configurable via Vite env)
const API_BASE = import.meta?.env?.VITE_API_BASE_URL ?? "http://localhost:3000";

// Terms (sample)
// const TERMS = [
//   { id: "1/2568", label: "1/2568" },
//   { id: "2/2568", label: "2/2568" },
// ];

// Helpers
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const isoDateToENday = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return DAYS[d.getDay()];
};
const normalizeTime24 = (t) => {
  if (!t) return "";
  const s = String(t).trim();
  // Already HH:MM format
  const m1 = s.match(/^([0-2]?\d):([0-5]\d)$/);
  if (m1) {
    const h = Math.max(0, Math.min(23, parseInt(m1[1], 10)));
    const mm = m1[2];
    return String(h).padStart(2, "0") + ":" + mm;
  }
  // H:MM AM/PM
  const m2 = s.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (m2) {
    let h = parseInt(m2[1], 10);
    const mm = m2[2];
    const ap = m2[3].toUpperCase();
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return String(h).padStart(2, "0") + ":" + mm;
  }
  // HHMM
  const m3 = s.match(/^([0-2]?\d)([0-5]\d)$/);
  if (m3) {
    const h = Math.max(0, Math.min(23, parseInt(m3[1], 10)));
    const mm = m3[2];
    return String(h).padStart(2, "0") + ":" + mm;
  }
  return s;
};
const timeToNumber = (t) => {
  const norm = normalizeTime24(t);
  const hh = parseInt(norm.slice(0, 2), 10);
  const mm = norm.slice(3, 5);
  return hh + (mm === "30" ? 0.5 : 0);
};
const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i); // 08 -> 17

function buildHourMap(blocks) {
  const map = new Map();
  for (const b of blocks) {
    const s = timeToNumber(b.start);
    const e = timeToNumber(b.end);
    for (let h = s; h < e; h += 1) map.set(h, b);
  }
  return map;
}

export default function Roomuse() {
  // Filters
  const [term, setTerm] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [subject, setSubject] = useState("");

  // Data
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState([]); // from tb_schedule
  const [results, setResults] = useState([]); // filtered

  // Load rooms and schedules
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const r = await fetch(`${API_BASE}/tb_room`);
        const data = await r.json();
        const mapped = Array.isArray(data)
          ? data.map((x) => ({
              id: String(x.room_id ?? x.id ?? x.room ?? ""),
              label: x.label ?? String(x.room_name ?? x.room_id ?? x.id ?? ""),
            }))
          : [];
        setRooms(mapped);
      } catch {
        setRooms([]);
      }
    };

    const loadSchedules = async () => {
      try {
        // Expect: GET /tb_schedule returns rows with columns like:
        // room_id, schedule_date (or date), start_time, end_time, subject, term, type
        const r = await fetch(`${API_BASE}/tb_schedule`);
        const data = await r.json();
        const mapScheduleItem = (b) => ({
          room: String(b.room ?? b.room_id ?? b.scd_room ?? ""),
          // backend ส่ง day เป็น string (e.g., 'Monday') — เก็บไว้ใน date เพื่อแสดง/กรองรายวัน
          date: b.date ?? b.day ?? b.scd_day ?? "",
          start: normalizeTime24(b.start ?? b.start_time ?? ""),
          end: normalizeTime24(b.end ?? b.end_time ?? ""),
          subject: b.subject ?? b.subj_name ?? "",
          term: b.term ?? b.scd_term ?? b.semester ?? "",
          type: b.type ?? b.use_type ?? "teaching",
        });

        const mapped = Array.isArray(data)
          ? data
              .map(mapScheduleItem)
              .filter((x) => x.room && x.date && x.start && x.end)
          : [];

        setSchedules(mapped);
        setResults(mapped);
        const firstTerm = mapped.find((x) => x.term)?.term || "";
        setTerm(firstTerm);
      } catch {
        setSchedules([]);
        setResults([]);
      }
    };

    loadRooms();
    loadSchedules();
  }, []);

  const filteredRooms = useMemo(
    () => (room ? rooms.filter((r) => r.id === room) : rooms),
    [room, rooms]
  );

  const handleSearch = async () => {
    const dayParam = day || isoDateToENday(date) || "";
    // Prefer server-side filtering to match actual DB columns
    const params = new URLSearchParams({
      term: term || "",
      date: dayParam,
      startTime: normalizeTime24(startTime) || "",
      endTime: normalizeTime24(endTime) || "",
      room: room || "",
      subject: subject || "",
    });
    try {
      const r = await fetch(`${API_BASE}/tb_schedule?` + params.toString());
      const data = await r.json();
      const mapped = Array.isArray(data)
        ? data.map((b) => ({
            room: String(b.room ?? b.room_id ?? b.roomId ?? ""),
            date: b.date ?? b.schedule_date ?? "",
            start: normalizeTime24(b.start ?? b.start_time ?? ""),
            end: normalizeTime24(b.end ?? b.end_time ?? ""),
            subject:
              b.subject ??
              [b.subj_id, b.subj_name].filter(Boolean).join(" ") ??
              "",
            type: b.type ?? b.use_type ?? "teaching",
            term: b.term ?? b.semester ?? "",
          }))
        : [];
      setResults(mapped.filter((x) => x.room && x.date && x.start && x.end));
    } catch {
      // Fallback to client-side filtering if server fails
      const base = schedules;
      const selectedDay = dayParam;
      const next = base.filter((b) => {
        const byTerm = !term || !b.term || b.term === term;
        const byDate = !selectedDay || b.date === selectedDay;
        const byRoom = !room || b.room === room;
        const bySubject =
          !subject ||
          (b.subject ?? "").toLowerCase().includes(subject.toLowerCase());
        const byStart =
          !startTime || timeToNumber(b.end) > timeToNumber(normalizeTime24(startTime));
        const byEnd = !endTime || timeToNumber(b.start) < timeToNumber(normalizeTime24(endTime));
        return byTerm && byDate && byRoom && bySubject && byStart && byEnd;
      });
      setResults(next);
    }
  };

  const handleClear = () => {
    setDate("");
    setDay("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setSubject("");
    setResults(schedules);
  };

  // Group results by room for the grid
  const grouped = useMemo(() => {
    const selectedDay = day || isoDateToENday(date) || "";
    const byRoom = new Map();
    for (const r of filteredRooms) byRoom.set(r.id, []);
    for (const b of results.filter(
      (b) =>
        (!room ? true : b.room === room) && (!selectedDay ? true : b.date === selectedDay)
    )) {
      byRoom.get(b.room)?.push(b);
    }
    return byRoom;
  }, [results, filteredRooms, room, date, day]);

  return (
    <>
      <div className="min-h-screen bg-white ml-64 mt-12">
        {/* Header / Filters */}
        <div className="w-full bg-gray-500 shadow-sm">
          <div className="container mx-auto px-4 py-6 text-black">
            <h1 className="text-xl md:text-2xl font-bold">
              ตารางการใช้ห้องเรียน
            </h1>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              {/* เทอม */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">เทอม</span>
                </div>
                <div className="input input-bordered w-full text-white flex items-center h-12">
                  <span className="text-white">{term || "-"}</span>
                </div>
              </label>

              {/* วันที่ */}
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">วันที่ (Date)</span>
                </div>
                <input
                  type="date"
                  className="input input-bordered text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              {/* Day of week */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Day</span>
                </div>
                <select
                  className="select select-bordered text-white"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  <option className="text-white" value="">All days</option>
                  {DAYS.map((d) => (
                    <option className="text-white" key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              {/* เวลาเริ่มต้น */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">เวลาเริ่มต้น (Start)</span>
                </div>
                <input
                  type="time"
                  lang="th-TH"
                  step="1800"
                  className="input input-bordered text-white"
                  value={normalizeTime24(startTime)}
                  onChange={(e) => setStartTime(normalizeTime24(e.target.value))}
                />
              </label>

              {/* เวลาสิ้นสุด */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">เวลาสิ้นสุด (End)</span>
                </div>
                <input
                  type="time"
                  lang="th-TH"
                  step="1800"
                  className="input input-bordered text-white"
                  value={normalizeTime24(endTime)}
                  onChange={(e) => setEndTime(normalizeTime24(e.target.value))}
                />
              </label>

              {/* ห้อง */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">ห้อง (Room)</span>
                </div>
                <select
                  className="select select-bordered text-white"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                >
                  <option className="text-white" value="">
                    เลือกห้อง
                  </option>
                  {rooms.map((r) => (
                    <option className="text-white" key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* วิชา */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">วิชา</span>
                </div>
                <input
                  type="text"
                  placeholder="พิมพ์เพื่อค้นหาชื่อวิชา"
                  className="input input-bordered text-white"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </label>

              {/* Actions */}
              <div className="md:col-span-6 flex gap-3 pt-1">
                <button
                  className="btn btn-success text-white"
                  onClick={handleSearch}
                >
                  ค้นหา
                </button>
                <button
                  className="btn btn-error text-white"
                  onClick={handleClear}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-500 rounded-2xl shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">ผลการค้นหา</h2>

            <div className="overflow-x-auto">
              {/* Header time columns */}
              <table className="table border">
                <thead>
                  <tr>
                    <th className="w-28 align-bottom">ห้อง</th>
                    {HOURS.map((h) => (
                      <th key={h} className="min-w-36 text-center">
                        <div className="font-semibold">
                          {String(h).padStart(2, "0")}:00-
                        </div>
                        <div className="text-xs text-base-content/70">
                          {String(h + 1).padStart(2, "0")}:00
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...grouped.keys()].map((roomId) => {
                    const blocks = grouped.get(roomId) || [];
                    const hourMap = buildHourMap(blocks);
                    return (
                      <tr key={roomId}>
                        <td className="font-medium">{roomId}</td>
                        {HOURS.map((h) => {
                          const b = hourMap.get(h);
                          const status = b?.type || "free";
                          const base =
                            status === "teaching"
                              ? "bg-blue-100 border-blue-200 text-black"
                              : status === "reserved"
                              ? "bg-rose-100 border-rose-200 text-black"
                              : "bg-white border-base-300 text-base-content/70";
                          return (
                            <td
                              key={h}
                              className={`align-middle border ${base}`}
                            >
                              {b ? (
                                <div className="text-xs leading-tight">
                                  <div className="font-medium">{b.subject}</div>
                                  <div className="opacity-70">
                                    {b.start}-{b.end}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs opacity-50">
                                  à¸§à¹ˆà¸²à¸‡
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-6 items-center">
              <Legend colorClass="bg-blue-200" label="สอน" />
              <Legend colorClass="bg-rose-200" label="จอง" />
              <Legend colorClass="bg-white border" label="ว่าง" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Legend({ colorClass, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-5 h-5 rounded ${colorClass}`}></span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
