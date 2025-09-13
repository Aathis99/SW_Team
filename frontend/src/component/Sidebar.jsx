import React from 'react'

function Sidebar({ onMenuClick }) {
  return (
    <aside
      id="sidebar-multi-level-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-yellow-100">
        {/* หัวข้อ */}
        <h2 className="text-lg font-bold mb-4 px-2">งาน Admin</h2>

        <ul className="space-y-2 font-medium">
          <li>
            <a href="#" className="a_sidebar group">
              <span className="span_sidebar">จัดการห้องเรียน</span>
            </a>
          </li>
          <li>
            <button
              type="button"
              onClick={() => onMenuClick && onMenuClick('manageSubject')}
              className="a_sidebar w-full text-left"
            >
              <span className="span_sidebar">จัดการรายวิชา</span>
            </button>
          </li>
          <li>
            <a href="#" className="a_sidebar group">
              <span className="span_sidebar">จัดการตารางสอน</span>
            </a>
          </li>
          <li>
            <a href="#" className="a_sidebar group">
              <span className="span_sidebar">จัดการใช้ห้องเรียน</span>
            </a>
          </li>
          <li>
            <a href="#" className="a_sidebar group">
              <span className="span_sidebar">จัดการจองห้อง</span>
            </a>
          </li>
          <li>
            <a href="#" className="a_sidebar group">
              <span className="span_sidebar">ออกรายงาน</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
