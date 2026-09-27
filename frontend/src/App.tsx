import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import JobCreatePage from './pages/JobCreatePage';
import JobDetailPage from './pages/JobDetailPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import VehiclesPage from './pages/VehiclesPage';
import TowTrucksPage from './pages/TowTrucksPage';
import DriversPage from './pages/DriversPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/new" element={<JobCreatePage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/towtrucks" element={<TowTrucksPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
