import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="tt-content">
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="tt-main">{children}</main>
      </div>
    </div>
  );
}
