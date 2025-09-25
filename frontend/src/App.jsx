import React, { useState } from "react";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import ManageSubject from "./page/ManageSubject";
import RoomManage from "./page/roommanage";
import Schedulemanage from "./page/Schedulemanage";
import Roomuse from "./page/Roomuse";
import Roombooking from "./page/Roombooking";
import Report from "./page/Report";

function App() {
  const [activePage, setActivePage] = useState(null);

  return (
    <>
      <Navbar />
      <Sidebar onMenuClick={setActivePage} />
      {activePage === 'manageSubject' && <ManageSubject />}
      {activePage === 'roommanage' && <RoomManage />}
      {activePage === 'Schedulemanage' && <Schedulemanage />}
      {activePage === 'Roomuse' && <Roomuse />}
      {activePage === 'Roombooking' && <Roombooking />}
      {activePage === 'Report' && <Report />}
    </>
  );
}

export default App;
