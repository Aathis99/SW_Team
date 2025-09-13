import React, { useState } from "react";

function ManageSubject() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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
                <th className="px-4 py-2">อาจารย์ผู้สอน</th>
                <th className="px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b text-black">
                <td className="px-4 py-2">5674891</td>
                <td className="px-4 py-2">ตัวอย่างรายวิชาเพื่อทดสอบการแสดงผล</td>
                <td className="px-4 py-2">1 (45)</td>
                <td className="px-4 py-2">xxx</td>
                <td className="px-4 py-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    ลบ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-96">
            <div className="flex items-center justify-between bg-orange-300 px-4 py-2 rounded-t-lg">
              <h3 className="text-lg font-bold text-black">เพิ่มรายวิชา</h3>
              <button onClick={closeModal} className="text-black">
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-end space-x-2 mt-4">
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
        </div>
      )}
    </>
  );
}

export default ManageSubject;
