import React from "react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-12 bg-orange-300 flex items-center justify-between px-4 z-50 shadow">
      
      {/* เว้นซ้ายว่างไว้ (เผื่อปุ่ม menu ภายหลัง) */}
      <div className="w-8"></div>
      
      {/* โลโก้ + ชื่อระบบ */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs font-bold">LOGO</span>
        </div>
        <h1 className="text-sm md:text-base font-semibold text-gray-800">
          ระบบการจองใช้ห้องเรียนสาขาวิศวกรรมซอฟต์แวร์ LPRU
        </h1>
      </div>

      {/* {ชื่อผู้ใชงาน} */}
      <div className="text-sm font-medium text-gray-800">
        คุณ xxxxxx xxxxxx
      </div>
    </nav>
  );
}

export default Navbar;
