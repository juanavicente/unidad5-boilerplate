import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import AdminLoginPage from './modules/auth/pages/AdminLoginPage';
import PatientLoginPage from './modules/patients/pages/PatientLoginPage';
import PatientLayout from './modules/patients/components/PatientLayout';
import PatientHome from './modules/patients/pages/PatientHome';
import AppointmentsPage from './modules/patients/pages/AppointmentsPage';
import DashboardLayout from './modules/dashboard/components/DashboardLayout';
import OverviewPage from './modules/dashboard/pages/OverviewPage';
import DoctorsPage from './modules/doctors/pages/DoctorsPage';
import CreateDoctorPage from './modules/doctors/pages/CreateDoctorPage';
import DoctorDetailPage from './modules/doctors/pages/DoctorDetailPage';
import EditDoctorPage from './modules/doctors/pages/EditDoctorPage';
import SpecialtiesPage from './modules/specialties/pages/SpecialtiesPage';
import CreateSpecialtyPage from './modules/specialties/pages/CreateSpecialtyPage';
import EditSpecialtyPage from './modules/specialties/pages/EditSpecialtyPage';
import AppointmentsSearchPage from './modules/appointments/pages/AppointmentsSearchPage';
import AvailabilitiesPage from './modules/availabilities/pages/AvailabilitiesPage';

const routes = [
  {
    path: '/login',
    element: <PatientLoginPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute redirectTo="/login" allowedRole="Paciente">
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
  {
    path: '/admin',
    element: (
      <ProtectedRoute redirectTo="/admin/login" allowedRole="Administrador">
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
      {
        path: 'availabilities',
        element: <AvailabilitiesPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
