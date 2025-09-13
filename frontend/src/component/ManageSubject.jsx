
  return (
    <main className="ml-64 mt-12 p-6 bg-orange-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">

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
  );
}

export default ManageSubject;
