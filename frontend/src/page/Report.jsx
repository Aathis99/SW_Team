import React, { useEffect, useMemo, useState } from "react";

const mockReports = [
  {
    id: 1,
    room: "LAB-101",
    subject: "การเขียนโปรแกรมเบื้องต้น",
    requester: "อาจารย์กมล",
    date: "2024-05-15",
    startTime: "09:00",
    endTime: "11:00",
    hours: 2,
    status: "approved",
  },
  {
    id: 2,
    room: "LAB-205",
    subject: "เทคโนโลยีสารสนเทศ",
    requester: "อาจารย์ศิริพร",
    date: "2024-05-18",
    startTime: "13:00",
    endTime: "16:00",
    hours: 3,
    status: "pending",
  },
  {
    id: 3,
    room: "ROOM-310",
    subject: "กิจกรรมชมรม",
    requester: "ชมรมหุ่นยนต์",
    date: "2024-05-20",
    startTime: "08:30",
    endTime: "10:30",
    hours: 2,
    status: "approved",
  },
  {
    id: 4,
    room: "LAB-101",
    subject: "การทดลองวิทยาศาสตร์",
    requester: "อาจารย์พลอย",
    date: "2024-05-11",
    startTime: "10:00",
    endTime: "12:00",
    hours: 2,
    status: "cancelled",
  },
  {
    id: 5,
    room: "ROOM-120",
    subject: "การสอบกลางภาค",
    requester: "สำนักวิชาวิทยาศาสตร์",
    date: "2024-05-25",
    startTime: "12:30",
    endTime: "15:30",
    hours: 3,
    status: "approved",
  },
];

const statusToBadge = {
  approved: "badge-success",
  pending: "badge-warning",
  cancelled: "badge-error",
};

const statusToLabel = {
  approved: "อนุมัติแล้ว",
  pending: "รอดำเนินการ",
  cancelled: "ยกเลิก",
};

const parseDateOnly = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

function Report() {
  const [filters, setFilters] = useState({
    room: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: เปลี่ยนเป็นการเรียก API จริงเมื่อพร้อมเชื่อมต่อหลังบ้าน
      // ตัวอย่าง: const { data } = await api.get("/reports", { params: filters });
      const data = mockReports;
      setReports(data);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({ room: "", status: "all", dateFrom: "", dateTo: "" });
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    // ฟอร์มพร้อมส่งค่า filters ไปยัง API เมื่อเชื่อมต่อหลังบ้าน
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchRoom =
        !filters.room ||
        report.room.toLowerCase().includes(filters.room.toLowerCase());

      const matchStatus =
        filters.status === "all" || report.status === filters.status;

      const reportDate = parseDateOnly(report.date);
      const fromDate = parseDateOnly(filters.dateFrom);
      const toDate = parseDateOnly(filters.dateTo);

      const matchDateFrom = !fromDate || reportDate >= fromDate;
      const matchDateTo = !toDate || reportDate <= toDate;

      return matchRoom && matchStatus && matchDateFrom && matchDateTo;
    });
  }, [reports, filters]);

  const summary = useMemo(() => {
    const totalReservations = filteredReports.length;
    const totalHours = filteredReports.reduce(
      (sum, current) => sum + (current.hours || 0),
      0
    );
    const cancelled = filteredReports.filter(
      (item) => item.status === "cancelled"
    ).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = filteredReports.filter((item) => {
      const date = parseDateOnly(item.date);
      return date && date >= today;
    }).length;

    return { totalReservations, totalHours, cancelled, upcoming };
  }, [filteredReports]);

  return (
    <main className="min-h-screen bg-orange-100 pt-16 pb-10 transition-all sm:ml-64">
      <section className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-neutral">
              รายงานการจองห้องเรียน
            </h1>
            <p className="text-sm text-neutral/70">
              ตรวจสอบสถิติห้องเรียนและรายละเอียดการจอง พร้อมปรับแต่งเงื่อนไขเพื่อค้นหาข้อมูล
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm "
              onClick={fetchReports}
            >
              รีเฟรชข้อมูล
            </button>
            <button type="button" className="btn btn-sm btn-primary">
              ดาวน์โหลดรายงาน
            </button>
          </div>
        </header>

        {/* <div className="stats stats-vertical gap-4 shadow-lg sm:stats-horizontal">
          <div className="stat">
            <div className="stat-title">จำนวนการจองทั้งหมด</div>
            <div className="stat-value text-primary">
              {summary.totalReservations.toLocaleString("th-TH")}
            </div>
            <div className="stat-desc">รายการที่ตรงกับเงื่อนไขปัจจุบัน</div>
          </div>

          <div className="stat">
            <div className="stat-title">ชั่วโมงการใช้งาน</div>
            <div className="stat-value text-secondary">
              {summary.totalHours.toLocaleString("th-TH", {
                maximumFractionDigits: 1,
              })}
            </div>
            <div className="stat-desc">รวมเวลาการใช้ห้อง (ชั่วโมง)</div>
          </div>

          <div className="stat">
            <div className="stat-title">รายการที่ยกเลิก</div>
            <div className="stat-value text-error">
              {summary.cancelled.toLocaleString("th-TH")}
            </div>
            <div className="stat-desc">สถานะยกเลิกหรือไม่อนุมัติ</div>
          </div>

          <div className="stat">
            <div className="stat-title">การจองที่กำลังจะมาถึง</div>
            <div className="stat-value text-success">
              {summary.upcoming.toLocaleString("th-TH")}
            </div>
            <div className="stat-desc">วันที่เท่ากับหรือมากกว่าวันปัจจุบัน</div>
          </div>
        </div> */}

        <form
          onSubmit={handleApplyFilters}
          className="mt-8 grid gap-4 rounded-xl border border-base-200 bg-white text-black p-6 shadow-sm lg:grid-cols-12"
        >
          <div className="form-control lg:col-span-3">
            <label className="label">
              <span className="label-text font-medium">ห้องเรียน</span>
            </label>
            <input
              type="text"
              placeholder="เช่น LAB-101"
              className="input input-bordered bg-neutral text-white placeholder:text-white/70"
              value={filters.room}
              onChange={handleFilterChange("room")}
            />
          </div>

          <div className="form-control lg:col-span-3">
            <label className="label">
              <span className="label-text font-medium">สถานะการจอง</span>
            </label>
            <select
              className="select select-bordered bg-neutral text-white"
              value={filters.status}
              onChange={handleFilterChange("status")}
            >
              <option value="all" className="bg-neutral text-white">
                ทั้งหมด
              </option>
              <option value="approved" className="bg-neutral text-white">
                อนุมัติแล้ว
              </option>
              <option value="pending" className="bg-neutral text-white">
                รอดำเนินการ
              </option>
              <option value="cancelled" className="bg-neutral text-white">
                ยกเลิก
              </option>
            </select>
          </div>

          <div className="form-control lg:col-span-3">
            <label className="label">
              <span className="label-text font-medium">วันที่เริ่มต้น</span>
            </label>
            <input
              type="date"
              className="input input-bordered bg-neutral text-white"
              value={filters.dateFrom}
              onChange={handleFilterChange("dateFrom")}
            />
          </div>

          <div className="form-control lg:col-span-3">
            <label className="label">
              <span className="label-text font-medium">วันที่สิ้นสุด</span>
            </label>
            <input
              type="date"
              className="input input-bordered bg-neutral text-white"
              value={filters.dateTo}
              onChange={handleFilterChange("dateTo")}
            />
          </div>

          <div className="lg:col-span-12 flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleResetFilters}
            >
              ล้างตัวกรอง
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              ใช้ตัวกรอง
            </button>
          </div>
        </form>

        <section className="mt-8 rounded-xl border border-base-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral">
              รายการการจองที่ตรงกับตัวกรอง
            </h2>
            <span className="badge badge-outline">
              {filteredReports.length.toLocaleString("th-TH")} รายการ
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="text-sm text-neutral">
                  <th>วันที่</th>
                  <th>เวลา</th>
                  <th>ห้องเรียน</th>
                  <th>วิชา / กิจกรรม</th>
                  <th>ผู้จอง</th>
                  <th>ชั่วโมง</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={7}>
                        <div className="flex flex-wrap gap-4">
                          <div className="skeleton h-4 w-28" />
                          <div className="skeleton h-4 w-20" />
                          <div className="skeleton h-4 w-24" />
                          <div className="skeleton h-4 w-32" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-10 text-sm text-neutral/60">
                        <div className="mb-2 text-base font-medium text-neutral">
                          ไม่พบข้อมูล
                        </div>
                        <p>ปรับเปลี่ยนเงื่อนไขการค้นหาหรือรีเฟรชข้อมูลอีกครั้ง</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report,index) => (
                    <tr key={report.id} className="text-black">
                      <td className="whitespace-nowrap">{report.date}</td>
                      <td>{`${report.startTime} - ${report.endTime}`}</td>
                      <td>{report.room}</td>
                      <td>{report.subject}</td>
                      <td>{report.requester}</td>
                      <td>{report.hours}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            statusToBadge[report.status] || "badge-ghost"
                          }`}
                        >
                          {statusToLabel[report.status] || report.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Report;
