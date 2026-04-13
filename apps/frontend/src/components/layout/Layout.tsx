import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="layout-main">
        <Topbar />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};
