import React, { useState } from "react";

function ManageSubject() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="ml-64 mt-12 p-6 bg-orange-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">จัดการรายวิชา</h2>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
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
              <tr className="border-b">
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow w-full max-w-md">
            <div className="flex items-center justify-between bg-orange-300 px-4 py-2 rounded-t-lg">
              <h3 className="font-bold">เพิ่มรายวิชา</h3>
              <button
                className="text-xl"
                onClick={() => setIsModalOpen(false)}
                aria-label="close"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-3">
              <input
                className="w-full border border-gray-300 rounded p-2"
                placeholder="กรอกรหัสรายวิชา"
              />
              <input
                className="w-full border border-gray-300 rounded p-2"
                placeholder="กรอกชื่อวิชา"
              />
              <input
                className="w-full border border-gray-300 rounded p-2"
                placeholder="กรอกจำนวนหน่วยกิต"
              />
              <input
                className="w-full border border-gray-300 rounded p-2"
                placeholder="กรอกชั่วโมงการเรียน"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  บันทึก
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ManageSubject;
