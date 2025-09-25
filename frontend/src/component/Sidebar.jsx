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
            <button
              type="button"
              onClick={() => onMenuClick && onMenuClick('roommanage')}
              className="a_sidebar w-full text-left"
            >
              <span className="span_sidebar">จัดการรายห้องเรียน</span>
            </button>
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
            <button
              type="button"
              onClick={() => onMenuClick && onMenuClick('Schedulemanage')}
              className="a_sidebar w-full text-left"
            >
              <span className="span_sidebar">จัดการตรางสอน</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => onMenuClick && onMenuClick('Roomuse')}
              className="a_sidebar w-full text-left"
            >
              <span className="span_sidebar">จัดการใช้ห้องเรียน</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => onMenuClick && onMenuClick('Roombooking')}
              className="a_sidebar w-full text-left"
            >
              <span className="span_sidebar">จัดการจองห้อง</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => onMenuClick && onMenuClick('Report')}
              className="a_sidebar w-full text-left"
            >
              <span className="span_sidebar">ออกรายงาน</span>
            </button>
          </li>

        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
