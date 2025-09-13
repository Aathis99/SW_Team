import React, { useState, useEffect } from "react";

function ManageSubject() {
  const [showModal, setShowModal] = useState(false);
  // เพิ่ม state สำหรับเก็บรายวิชา
  const [subjects, setSubjects] = useState([]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // ดึงข้อมูลรายวิชาจาก backend
  useEffect(() => {
    fetch("http://localhost:3000/subject")
      .then((res) => res.json())
      .then(setSubjects);
  }, []);

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
                <tr className="bg-orange-200 text-left">
                  <th className="px-4 py-2">รหัสรายวิชา</th>
                  <th className="px-4 py-2">ชื่อวิชา</th>
                  <th className="px-4 py-2">หน่วยกิต</th>
                  <th className="px-4 py-2">ชั่วโมงการเรียน</th>
                  <th className="px-4 py-2">จัดการ</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {console.log(subjects) /* เพิ่มบรรทัดนี้เพื่อดูข้อมูล */}
                {subjects.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.subj_id}</td>
                    <td>{sub.subj_name}</td>
                    <td>{sub.subj_credit}</td>
                    <td>({sub.subj_hours} ชม.)</td>
                    {/* <td>{sub.teacher}</td> */}
                    <td>
                      <button
                        onClick={closeModal}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
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
      {/* popup add subj */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-96 shadow-lg">
            <div className="bg-orange-300 text-black flex justify-between items-center px-4 py-2 rounded-t-lg">
              <h3 className="font-bold">เพิ่มรายวิชา</h3>
              <button onClick={closeModal}>✕</button>
            </div>

            <div className="p-4 space-y-3 text-black">
              <div>
                <label className="block text-sm">รหัสรายวิชา</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="กรอกรหัสรายวิชา"
                />
              </div>
              <div>
                <label className="block text-sm">ชื่อวิชา</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="กรอกชื่อวิชา"
                />
              </div>
              <div>
                <label className="block text-sm">หน่วยกิต</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="กรอกจำนวนหน่วยกิต"
                />
              </div>
              <div>
                <label className="block text-sm">ชั่วโมงการเรียน</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="กรอกชั่วโมงการเรียน"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                บันทึก
              </button>

              <button
                onClick={closeModal}
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
