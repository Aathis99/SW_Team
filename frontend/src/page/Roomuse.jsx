// import React from "react";

import React, { useMemo, useState } from "react";

/**
 * Room Availability Page – React + TailwindCSS + DaisyUI
 *
 * Notes:
 * - This component is self‑contained. Drop it into a Vite/CRA app configured with Tailwind + DaisyUI.
 * - Colors follow the mock: teaching (blue), reserved (rose), free (white).
 * - Replace MOCK_DATA with real API results when ready.
 */

// ===== Mock data =====
const ROOMS = [
  { id: "39401", label: "อ่องออ1" },
  { id: "39402", label: "อ่องออ2" },
  { id: "39403", label: "อ่องออ3" },
  { id: "39404", label: "อ่องออ4" },
]
const TERMS = [
  { id: "1/2568", label: "เทอม1/2568" },
  { id: "2/2568", label: "เทอม2/2568" },
];

// A single booking block
// type: "teaching" | "reserved"
const MOCK_DATA = [
  {
    room: "39401",
    date: "2025-09-22",
    start: "13:00",
    end: "16:00",
    type: "teaching",
    subject: "ซอฟต์แวร์เป็นทีม",
  },
  {
    room: "39403",
    date: "2025-09-24",
    start: "13:00",
    end: "14:00",
    type: "reserved",
    subject: "สอบกลางภาค",
  },
  {
    room: "39403",
    date: "2025-09-24",
    start: "09:00",
    end: "12:00",
    type: "teaching",
    subject: "เตรียมสหกิจ",
  },
  {
    room: "39404",
    date: "2025-09-24",
    start: "09:00",
    end: "12:00",
    type: "teaching",
    subject: "Porject Software",
  },
];

// ===== Helpers =====
const timeToNumber = (t) =>
  parseInt(t.slice(0, 2), 10) + (t.slice(3) === "30" ? 0.5 : 0);

const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i); // 08 -> 17 (ending 18:00 column label)

// Map booking blocks to hourly buckets for quick lookup
function buildHourMap(blocks) {
  const map = new Map();
  for (const b of blocks) {
    const s = timeToNumber(b.start);
    const e = timeToNumber(b.end);
    for (let h = s; h < e; h += 1) {
      map.set(h, b);
    }
  }
  return map;
}

export default function Roomuse() {
  // Filters
  const [term, setTerm] = useState(TERMS[0].id);
  const [date, setDate] = useState("2025-09-24");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [subject, setSubject] = useState("");

  const [results, setResults] = useState(MOCK_DATA);

  const filteredRooms = useMemo(
    () => (room ? ROOMS.filter((r) => r.id === room) : ROOMS),
    [room]
  );

  const handleSearch = () => {
    // In real use, call API with filters.
    const next = MOCK_DATA.filter((b) => {
      const byDate = !date || b.date === date;
      const byRoom = !room || b.room === room;
      const bySubject =
        !subject || b.subject.toLowerCase().includes(subject.toLowerCase());
      const byStart =
        !startTime || timeToNumber(b.end) > timeToNumber(startTime);
      const byEnd = !endTime || timeToNumber(b.start) < timeToNumber(endTime);
      return byDate && byRoom && bySubject && byStart && byEnd;
    });
    setResults(next);
  };

  const handleClear = () => {
    setTerm(TERMS[0].id);
    setDate("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setSubject("");
    setResults(MOCK_DATA);
  };

  // Group results by room for the grid
  const grouped = useMemo(() => {
    const byRoom = new Map();
    for (const r of filteredRooms) byRoom.set(r.id, []);
    for (const b of results.filter(
      (b) =>
        (!room ? true : b.room === room) && (!date ? true : b.date === date)
    )) {
      byRoom.get(b.room)?.push(b);
    }
    return byRoom;
  }, [results, filteredRooms, room, date]);

  return (
    <>
      <div className="min-h-screen bg-white ml-64 mt-12">
        {/* Header / Filters */}
        <div className="w-full bg-gray-500 shadow-sm">
          <div className="container mx-auto px-4 py-6 text-black">
            <h1 className="text-xl md:text-2xl font-bold">
              แสดงเวลาว่างห้องเรียน
            </h1>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              {/* เทอม */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">เทอม</span>
                </div>
                <select
                  className="select select-bordered w-full text-white"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                >
                  {TERMS.map((t) => (
                    <option className="text-white" key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
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

              {/* เวลาเริ่ม */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">เวลาเริ่ม (เรียน)</span>
                </div>
                <input
                  type="time"
                  className="input input-bordered text-white"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>

              {/* เวลาสิ้นสุด */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">เวลาสิ้นสุด (เรียน)</span>
                </div>
                <input
                  type="time"
                  className="input input-bordered text-white"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>

              {/* ห้อง */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">ห้อง (room)</span>
                </div>
                <select
                  className="select select-bordered text-white"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                >
                  <option className="text-white" value="">ทั้งหมด</option>
                  {ROOMS.map((r) => (
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
                  placeholder="ค้นหาวิชา…"
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
                  ล้าง
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-500 rounded-2xl shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">
              แสดงเวลาว่างห้องเรียน
            </h2>

            <div className="overflow-x-auto">
              {/* Header time columns */}
              <table className="table border">
                <thead>
                  <tr>
                    <th className="w-28 align-bottom">เวลา</th>
                    {HOURS.map((h, idx) => (
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
                            // หากมีการสอนจะให้สีพื้นเป็นสีน้ำเงิน
                              ? "bg-blue-100 border-blue-200 text-black"
                              // หากถูกจองจะให้สีพื้นเป็นสีชมพู
                              : status === "reserved"
                              ? "bg-rose-100 border-rose-200 text-black"
                              // หากว่างจะให้สีพื้นเป็นสีขาว
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
                                    {b.start}–{b.end}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs opacity-50">ว่าง</div>
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
              <Legend colorClass="bg-blue-200" label="ตารางสอน" />
              <Legend colorClass="bg-rose-200" label="ติดจอง" />
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

// export default Roomuse;


