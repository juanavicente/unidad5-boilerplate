import { useEffect, useMemo, useState } from 'react';

import { instance } from '../../shared/api/axiosInstance';
import Card from '../../shared/components/Card';

import {
  getDoctorAvailabilities,
  createAvailability,
  updateAvailability,
} from '../services/availabilityService';

import AvailabilityForm from '../components/AvailabilityForm';

function AvailabilitiesPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availabilities, setAvailabilities] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Obtener los médicos activos.
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError('');

        const response = await instance.get('/api/doctors', {
          params: {
            pageSize: 100,
            pageIndex: 1,
          },
        });

        const result =
          response.data?.data ?? response.data?.Data ?? response.data;

        const doctorsData = Array.isArray(result) ? result : [];

        setDoctors(doctorsData.filter((doctor) => doctor.isActive));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'No se pudieron cargar los médicos. Verificá que el servidor esté funcionando.'
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  // Obtener las disponibilidades del médico seleccionado.
  useEffect(() => {
    if (!selectedDoctor) {
      setAvailabilities([]);

      return;
    }

    const loadAvailabilities = async () => {
      try {
        setLoadingAvailabilities(true);
        setError('');
        setSuccess('');

        const data = await getDoctorAvailabilities(selectedDoctor);

        setAvailabilities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'No se pudieron consultar las disponibilidades del médico.'
        );

        setAvailabilities([]);
      } finally {
        setLoadingAvailabilities(false);
      }
    };

    loadAvailabilities();
  }, [selectedDoctor]);

  // Médico seleccionado.
  const doctor = useMemo(
    () => doctors.find((item) => item.id === selectedDoctor),
    [doctors, selectedDoctor]
  );

  // Preparar los horarios para el formulario.
  const initialValues = useMemo(
    () =>
      availabilities.map((item) => ({
        day: item.day,
        startTime: item.startTime?.substring(0, 5),
        endTime: item.endTime?.substring(0, 5),
      })),
    [availabilities]
  );

  // Guardar las disponibilidades.
  const handleSaveAvailability = async (formData) => {
    if (!selectedDoctor) {
      setError('Primero seleccioná un médico.');

      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      const request = {
        doctorId: selectedDoctor,
        days: formData.days,
      };

      if (availabilities.length > 0) {
        await updateAvailability(request);
      } else {
        await createAvailability(request);
      }

      const updated = await getDoctorAvailabilities(selectedDoctor);

      setAvailabilities(Array.isArray(updated) ? updated : []);

      setSuccess('La disponibilidad horaria se guardó correctamente.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Ocurrió un error al guardar las disponibilidades.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Navegación y encabezado */}
      <div>
        <div className="flex items-center gap-2 text-[11px] text-med-text-muted mb-3">
          <span>Doctores</span>
          <span>›</span>
          <span className="font-semibold text-med-primary-900">
            Disponibilidad Horaria
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-med-primary-900">
          Gestionar Disponibilidad Horaria
        </h1>

        <p className="text-sm text-med-text-sub mt-1">
          Definí los días y rangos horarios de atención para el profesional
          seleccionado.
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div
          role="alert"
          className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm"
        >
          {success}
        </div>
      )}

      {/* Distribución principal */}
      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] gap-4 items-start">
        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <h2 className="text-sm font-bold text-med-primary-900 mb-3">
              Seleccionar Profesional
            </h2>

            <select
              id="doctor"
              value={selectedDoctor}
              onChange={(event) => {
                setSelectedDoctor(event.target.value);
                setError('');
                setSuccess('');
              }}
              disabled={loadingDoctors || isSubmitting}
              className="w-full border border-med-border rounded-lg px-3 py-2.5 text-xs bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-100"
            >
              <option value="">
                {loadingDoctors
                  ? 'Cargando profesionales...'
                  : 'Seleccionar médico'}
              </option>

              {doctors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.licenseNumber}
                </option>
              ))}
            </select>

            {/* Información del profesional */}
            {doctor ? (
              <div className="mt-4 rounded-lg bg-med-primary-50 p-3 flex gap-3 items-start">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white border border-med-border flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-med-primary-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 21a8 8 0 00-16 0m12-13a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-med-primary-900">
                    {doctor.name}
                  </p>

                  <p className="text-[11px] text-med-text-sub mt-1">
                    Matrícula: {doctor.licenseNumber}
                  </p>

                  {doctor.specialty?.name && (
                    <p className="text-[11px] text-med-text-sub mt-1">
                      {doctor.specialty.name}
                    </p>
                  )}

                  <span className="inline-flex mt-2 px-2 py-1 rounded-full text-[10px] font-semibold bg-med-active-bg text-med-active-text">
                    Médico activo
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-lg bg-med-primary-50 text-center">
                <p className="text-xs text-med-text-muted">
                  Seleccioná un profesional para visualizar sus datos.
                </p>
              </div>
            )}
          </Card>

          {/* Información sobre los cambios */}
          <Card className="p-4">
            <div className="flex gap-2 items-start">
              <svg
                className="w-4 h-4 shrink-0 text-med-primary-700 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-4m0-4h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>

              <p className="text-[11px] leading-relaxed text-med-text-sub">
                Los cambios realizados se aplicarán a partir de la próxima
                semana calendario. Las citas ya programadas no se verán
                afectadas automáticamente.
              </p>
            </div>
          </Card>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="min-w-0">
          {!selectedDoctor && !loadingDoctors ? (
            <Card className="min-h-[300px] flex flex-col items-center justify-center text-center">
              <svg
                className="w-10 h-10 text-med-text-muted mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14H3V6a2 2 0 012-2z"
                />
              </svg>

              <h2 className="text-sm font-bold text-med-primary-900">
                Configuración de Horarios
              </h2>

              <p className="text-xs text-med-text-muted mt-2 max-w-xs">
                Seleccioná un profesional para configurar sus días y horarios de
                atención.
              </p>
            </Card>
          ) : (
            <AvailabilityForm
              onSubmit={handleSaveAvailability}
              isSubmitting={isSubmitting || loadingAvailabilities}
              submitLabel={
                availabilities.length > 0
                  ? 'Guardar Disponibilidad'
                  : 'Guardar Disponibilidad'
              }
              initialValues={initialValues}
              selectedDoctor={selectedDoctor}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AvailabilitiesPage;
