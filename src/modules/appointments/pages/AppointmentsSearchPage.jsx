
import { useEffect, useState } from 'react';
import {
  getAppointments,
  getSpecialties,
  getDoctors,
} from '../services/appointmentService';
import TablePagination from '../../shared/components/TablePagination';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function AppointmentsSearchPage() {
  // Filtros
  const [patientQuery, setPatientQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});

  // Datos para los selectores
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filtersError, setFiltersError] = useState('');

  // Citas
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Paginación
  const [pageIndex, setPageIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  // Cargar especialidades y médicos
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setFiltersError('');

        const [specialtiesResponse, doctorsResponse] = await Promise.all([
          getSpecialties(),
          getDoctors(),
        ]);

        setSpecialties(specialtiesResponse.data ?? []);
        setDoctors(doctorsResponse.data ?? []);
      } catch (err) {
        console.error('Error al cargar filtros:', err);
        setFiltersError(
          'No se pudieron cargar los médicos y especialidades.'
        );
      }
    };

    loadFilters();
  }, []);

  // Cargar citas reales
  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getAppointments({
          pageSize,
          pageIndex: pageIndex + 1,
        ...appliedFilters,
        });

        if (cancelled) return;

        setAppointments(response.data ?? []);
        setTotal(response.total ?? 0);
      } catch (err) {
        if (cancelled) return;

        console.error('Error al cargar citas:', err);
        setError('No se pudieron cargar las citas.');
        setAppointments([]);
        setTotal(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [pageIndex, appliedFilters]);

  // Filtrar médicos según la especialidad seleccionada
  const filteredDoctors = specialtyFilter
    ? doctors.filter((doctor) => {
        const doctorSpecialtyId =
          doctor.specialityId ??
          doctor.speciality?.id ??
          doctor.specialtyId ??
          doctor.specialty?.id ??
          doctor.speciality?.specialityId ??
          doctor.specialty?.specialtyId;

        return (
          String(doctorSpecialtyId).toLowerCase() ===
          specialtyFilter.toLowerCase()
        );
      })
    : doctors;

  // Transformar citas al formato de la tabla
  const appointmentsData = appointments.map((appointment) => {
    const status = appointment.appointmentsStatus?.toUpperCase();

    let statusType = 'other';
    let statusLabel = status || 'SIN ESTADO';

    if (status === 'BOOKED' || status === 'CONFIRMED') {
      statusType = 'confirmed';
      statusLabel = 'CONFIRMADO';
    } else if (status === 'COMPLETED') {
      statusType = 'completed';
      statusLabel = 'COMPLETADO';
    } else if (status === 'CANCELLED' || status === 'CANCELED') {
      statusType = 'cancelled';
      statusLabel = 'CANCELADO';
    }

    const rawDate = appointment.availableTime?.date ?? '';

    let formattedDate = rawDate;

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split('-');
      formattedDate = `${day}/${month}/${year}`;
    }

    return {
      id: appointment.appointmentsId,
      date: formattedDate,
      time: appointment.availableTime?.startTime?.slice(0, 5) ?? '',
      department:
        appointment.doctor?.specialty?.name ?? 'Sin especialidad',
      doctor: appointment.doctor?.name ?? 'Sin médico',
      patient:
        appointment.patient?.fullName?.trim() || 'Nombre no disponible',
      dni: appointment.patient?.dni ?? 'No disponible',
      status: statusLabel,
      statusType,
    };
  });

  const handleApplyFilters = () => {
  const dni = patientQuery.trim().replace(/\./g, '');

  if (dni && !/^\d+$/.test(dni)) {
    setError('Ingrese un DNI válido, utilizando solo números.');
    return;
  }

  setError('');

  setPageIndex(0);

  setAppliedFilters({
    dni: dni || null,
    specialtyId: specialtyFilter || null,
    doctorId: doctorFilter || null,
    date: dateFilter || '',
  });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>

        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      {/* Criterios de búsqueda */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
          {/* DNI */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-query"
              className="text-xs font-semibold text-med-text-sub"
            >
              DNI del Paciente
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>

              <input
                id="patient-query"
                type="text"
                inputMode="numeric"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="Ingresar DNI..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              />
            </div>
          </div>

          {/* Especialidad */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="specialty-filter"
              className="text-xs font-semibold text-med-text-sub"
            >
              Especialidad
            </label>

            <select
              id="specialty-filter"
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter(e.target.value);
                setDoctorFilter('');
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todas las Especialidades</option>

              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          {/* Médico */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="doctor-filter"
              className="text-xs font-semibold text-med-text-sub"
            >
              Doctor
            </label>

            <select
              id="doctor-filter"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            >
              <option value="">Todos los Doctores</option>

              {filteredDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="date-filter"
              className="text-xs font-semibold text-med-text-sub"
            >
              Fecha
            </label>

            <input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Aplicar filtros: pendiente de integración */}
          <div>
            <Button
               onClick={handleApplyFilters}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 text-white font-medium py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>

              <span>Aplicar Filtros</span>
            </Button>
          </div>

        </div>

        {/* Botón Limpiar Filtros */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => {
              setPatientQuery('');
              setSpecialtyFilter('');
              setDoctorFilter('');
              setDateFilter('');
              setPageIndex(0);
              setAppliedFilters({});
              setError('');
            }}
            className="text-xs font-medium text-med-primary-700 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      </Card>

      {/* Error al cargar filtros */}
      {filtersError && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {filtersError}
        </div>
      )}

      {/* Cargando citas */}
      {loading && (
        <p className="text-sm text-med-text-sub">
          Cargando citas...
        </p>
      )}

      {/* Error al cargar citas */}
      {error && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {error}
        </div>
      )}

      {/* Registros de citas */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-med-border-subtle">
              {!loading && appointmentsData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-med-text-muted"
                  >
                    {error
                      ? 'No fue posible obtener los registros.'
                      : 'No se encontraron citas registradas.'}
                  </td>
                </tr>
              )}

              {appointmentsData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* Fecha */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-med-primary-900 text-sm">
                      {item.date}
                    </p>

                    <p className="text-xs text-med-text-muted mt-0.5">
                      {item.time}
                    </p>
                  </td>

                  {/* Especialidad y médico */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.75"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="font-semibold text-med-primary-900">
                          {item.department}
                        </p>

                        <p className="text-xs text-med-text-muted">
                          {item.doctor}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Paciente */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-text-main">
                        DNI: {item.dni}
                      </p>
                    </td>

                  {/* Estado */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.statusType === 'confirmed'
                          ? 'bg-med-active-bg text-med-active-text'
                          : item.statusType === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : item.statusType === 'cancelled'
                              ? 'bg-med-danger-bg text-med-danger-text'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación real */}
        <TablePagination
          currentPage={pageIndex + 1}
          totalPages={Math.max(1, totalPages)}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={(page) => setPageIndex(page - 1)}
        />
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
