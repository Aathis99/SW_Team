import React, { useState } from "react";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import ManageSubject from "./component/ManageSubject";

function App() {
  const [activePage, setActivePage] = useState(null);

  return (
    <>
      <Navbar />
      <Sidebar onMenuClick={setActivePage} />
      {activePage === 'manageSubject' && <ManageSubject />}
    </>
  );
}

export default App;
