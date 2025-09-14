import React, { useEffect, useState, useCallback } from "react";

function ManageSubject() {
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    subj_id: "",
    subj_name: "",
    subj_credit: "",
    subj_hours: "",
  });
  const [errors, setErrors] = useState({});

  const openModal = () => {
    setShowModal(true);
    setErrors({});
  };
  const closeModal = () => setShowModal(false);

  const fetchSubjects = useCallback(async () => {
    try {
      const r = await fetch("http://localhost:3000/subject");
      const data = await r.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch {
      setSubjects([]);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.subj_id.trim()) next.subj_id = "กรุณากรอกรหัสวิชา";
    if (!form.subj_name.trim()) next.subj_name = "กรุณากรอกชื่อรายวิชา";
    if (form.subj_credit === "" || isNaN(Number(form.subj_credit)))
      next.subj_credit = "กรุณากรอกหน่วยกิตเป็นตัวเลข";
    if (form.subj_hours === "" || isNaN(Number(form.subj_hours)))
      next.subj_hours = "กรุณากรอกชั่วโมงเป็นตัวเลข";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCancel = () => {
    setForm({ subj_id: "", subj_name: "", subj_credit: "", subj_hours: "" });
    setErrors({});
    closeModal();
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:3000/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subj_id: form.subj_id.trim(),
          subj_name: form.subj_name.trim(),
          subj_credit: Number(form.subj_credit),
          subj_hours: Number(form.subj_hours),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");

      await fetchSubjects();

      setForm({ subj_id: "", subj_name: "", subj_credit: "", subj_hours: "" });
      setErrors({});
      closeModal();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id) => {
    const yes = window.confirm("ยืนยันการลบรายวิชานี้?");
    if (!yes) return;
    try {
      const res = await fetch(`http://localhost:3000/subject/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "ลบไม่สำเร็จ");
      await fetchSubjects();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <>
      <main className="ml-64 mt-12 p-6 bg-orange-100 min-h-screen">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">จัดการรายวิชา</h2>
            <button
              onClick={openModal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              เพิ่มรายวิชา
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-orange-200 text-left ">
                  <th className="px-4 py-2">รหัสวิชา</th>
                  <th className="px-4 py-2">ชื่อรายวิชา</th>
                  <th className="px-4 py-2">หน่วยกิต</th>
                  <th className="px-4 py-2">ชั่วโมง</th>
                  <th className="px-4 py-2">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {subjects.map((sub) => (
                  <tr className="p-1.5" key={sub.subj_id}>
                    <td>{sub.subj_id}</td>
                    <td>{sub.subj_name}</td>
                    <td>{sub.subj_credit}</td>
                    <td>({sub.subj_hours} ชม.)</td>
                    <td>
                      <button
                        onClick={() => handleDelete(sub.subj_id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded m-1"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-96 shadow-lg">
            <div className="bg-orange-300 text-black flex justify-between items-center px-4 py-2 rounded-t-lg">
              <h3 className="font-bold">เพิ่มรายวิชา</h3>
              <button onClick={handleCancel}>ปิด</button>
            </div>

            <div className="p-4 space-y-3 text-black">
              <div>
                <label className="block text-sm">รหัสวิชา</label>
                <input
                  name="subj_id"
                  value={form.subj_id}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.subj_id ? "border-red-500" : ""}`}
                  placeholder="เช่น CS101"
                />
                {errors.subj_id && (
                  <p className="text-red-600 text-xs mt-1">{errors.subj_id}</p>
                )}
              </div>
              <div>
                <label className="block text-sm">ชื่อรายวิชา</label>
                <input
                  name="subj_name"
                  value={form.subj_name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.subj_name ? "border-red-500" : ""}`}
                  placeholder="เช่น โครงสร้างข้อมูล"
                />
                {errors.subj_name && (
                  <p className="text-red-600 text-xs mt-1">{errors.subj_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm">หน่วยกิต</label>
                <input
                  name="subj_credit"
                  value={form.subj_credit}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.subj_credit ? "border-red-500" : ""}`}
                  placeholder="เช่น 3"
                />
                {errors.subj_credit && (
                  <p className="text-red-600 text-xs mt-1">{errors.subj_credit}</p>
                )}
              </div>
              <div>
                <label className="block text-sm">ชั่วโมง</label>
                <input
                  name="subj_hours"
                  value={form.subj_hours}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.subj_hours ? "border-red-500" : ""}`}
                  placeholder="เช่น 3"
                />
                {errors.subj_hours && (
                  <p className="text-red-600 text-xs mt-1">{errors.subj_hours}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                บันทึก
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageSubject;

