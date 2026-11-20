import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';

// Auth Module
import AdminLoginPage from './modules/auth/pages/AdminLoginPage';

// Patients Module
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';

// Dashboard Module
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import OverviewPage from './modules/dashboard/pages/OverviewPage';

// Domain Modules (Screaming Architecture)
import DoctorsPage from './modules/doctors/pages/DoctorsPage';
import CreateDoctorPage from './modules/doctors/pages/CreateDoctorPage';
import DoctorDetailPage from './modules/doctors/pages/DoctorDetailPage';
import EditDoctorPage from './modules/doctors/pages/EditDoctorPage';
import SpecialtiesPage from './modules/specialties/pages/SpecialtiesPage';
import CreateSpecialtyPage from './modules/specialties/pages/CreateSpecialtyPage';
import EditSpecialtyPage from './modules/specialties/pages/EditSpecialtyPage';
import AppointmentsSearchPage from './modules/appointments/pages/AppointmentsSearchPage';

const routes = [
  // Rutas públicas
  {
    path: '/login',
    element: <PatientLoginPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // Rutas privadas de pacientes (URL base y turnos)
  {
    path: '/',
    element: (
      <ProtectedRoute redirectTo="/login">
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PatientHome />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
    ],
  },

  // Rutas privadas de gestión clínica y administración
  {
    path: '/admin',
    element: (
      <ProtectedRoute redirectTo="/admin/login">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/home" replace />,
      },
      {
        path: 'home',
        element: <OverviewPage />,
      },
      {
        path: 'patients',
        element: <AppointmentsSearchPage />,
      },
      {
        path: 'patient-search',
        element: <AppointmentsSearchPage />,
      },
      {
        path: 'appointments',
        element: <Navigate to="/admin/patients" replace />,
      },
      {
        path: 'specialties',
        element: <SpecialtiesPage />,
      },
      {
        path: 'specialties/new',
        element: <CreateSpecialtyPage />,
      },
      {
        path: 'specialties/:id/edit',
        element: <EditSpecialtyPage />,
      },
      {
        path: 'doctors',
        element: <DoctorsPage />,
      },
      {
        path: 'doctors/new',
        element: <CreateDoctorPage />,
      },
      {
        path: 'doctors/:id/edit',
        element: <EditDoctorPage />,
      },
      {
        path: 'doctors/:id',
        element: <DoctorDetailPage />,
      },
    ],
  },

  // Redirección para cualquier otra URL
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

function App() {
  const router = createBrowserRouter(routes);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
