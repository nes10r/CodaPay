import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="dashboard-root">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout; 