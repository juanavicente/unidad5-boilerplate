import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import {
  getPatientAppointments,
  cancelAppointment,
} from '../../appointments/services/appointmentService';

function formatDate(date) {
  if (!date) return 'Fecha no disponible';

  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
}

function formatTime(time) {
  if (!time) return 'Horario no disponible';

  return time.slice(0, 5) + ' hs';
}

function getStatusInfo(status) {
  const normalizedStatus = String(status || '').toUpperCase();

  const statuses = {
    BOOKED: {
      label: 'Confirmado',
      className: 'bg-med-active-bg text-med-active-text',
    },
    CANCELLED: {
      label: 'Cancelado',
      className: 'bg-red-100 text-red-700',
    },
    ATTENDED: {
      label: 'Atendido',
      className: 'bg-blue-100 text-blue-700',
    },
    NO_SHOW: {
      label: 'Ausente',
      className: 'bg-gray-100 text-gray-700',
    },
  };

  return (
    statuses[normalizedStatus] || {
      label: status || 'Estado no disponible',
      className: 'bg-gray-100 text-gray-700',
    }
  );
}

function AppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getPatientAppointments();

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los turnos:', err);
      setError(
        'No pudimos cargar tus turnos. Verificá tu conexión e intentá nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Abrir el modal de confirmación.
  const handleCancel = (appointment) => {
    if (cancelingId !== null) return;

    setCancelError('');
    setAppointmentToCancel(appointment);
  };

  // Confirmar la cancelación y llamar al backend.
  const handleConfirmCancel = async () => {
    if (!appointmentToCancel || cancelingId !== null) return;

    const appointmentId = appointmentToCancel.appointmentId;

    try {
      setCancelingId(appointmentId);
      setCancelError('');

      await cancelAppointment(appointmentId);

      setAppointments((current) =>
        current.filter(
          (appointment) => appointment.appointmentId !== appointmentId
        )
      );

      setAppointmentToCancel(null);
    } catch (err) {
      console.error('Error al cancelar el turno:', err);

      const status = err.response?.status;

      if (status === 403) {
        setCancelError('No tenés permiso para cancelar este turno.');
      } else if (status === 404) {
        setCancelError('El turno ya no existe o fue cancelado.');
        setAppointmentToCancel(null);
        await loadAppointments();
      } else {
        setCancelError('No pudimos cancelar el turno. Intentá nuevamente.');
      }
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>

          <p className="text-sm text-med-text-sub mt-1">
            Consultá y gestioná tus turnos médicos programados.
          </p>
        </div>

        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      {loading && (
        <p className="text-sm text-med-text-sub">Cargando tus turnos...</p>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={loadAppointments}
            className="mt-2 text-sm font-semibold text-red-700 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && cancelError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{cancelError}</p>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-med-text-main">
              Todavía no tenés turnos
            </h2>

            <p className="text-sm text-med-text-sub mt-2">
              Cuando reserves un turno, vas a poder consultarlo desde acá.
            </p>

            <Button className="mt-4" onClick={() => navigate('/')}>
              Reservar un turno
            </Button>
          </div>
        </Card>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((appt) => {
            const statusInfo = getStatusInfo(appt.status);
            const isCanceling = cancelingId === appt.appointmentId;

            return (
              <Card
                key={appt.appointmentId}
                className="flex flex-col justify-between gap-4 p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                      {appt.doctor?.specialty?.name ?? 'Especialidad'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-med-primary-900">
                    {appt.doctor?.name ?? 'Médico no disponible'}
                  </h3>

                  <p className="text-sm text-med-text-sub mt-2">
                    Fecha:{' '}
                    <strong className="text-med-text-main font-semibold">
                      {formatDate(appt.availableTime?.date)}
                    </strong>{' '}
                    de{' '}
                    <strong className="text-med-text-main font-semibold">
                      {formatTime(appt.availableTime?.startTime)}
                    </strong>{' '}
                    a{' '}
                    <strong className="text-med-text-main font-semibold">
                      {formatTime(appt.availableTime?.endTime)}
                    </strong>
                  </p>

                  {appt.reason && (
                    <p className="text-sm text-med-text-sub mt-2">
                      Motivo:{' '}
                      <strong className="text-med-text-main font-semibold">
                        {appt.reason}
                      </strong>
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-med-border">
                  <Button
                    variant="outline"
                    className="w-full text-xs"
                    disabled={cancelingId !== null}
                    onClick={() => handleCancel(appt)}
                  >
                    {isCanceling ? 'Cancelando...' : 'Cancelar Turno'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal personalizado de confirmación */}
      {appointmentToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2
              id="cancel-modal-title"
              className="text-xl font-bold text-med-text-main"
            >
              ¿Cancelar este turno?
            </h2>

            <p className="mt-3 text-sm text-med-text-sub">
              Estás por cancelar tu turno con{' '}
              <strong className="text-med-text-main">
                {appointmentToCancel.doctor?.name ?? 'el médico seleccionado'}
              </strong>
              .
            </p>

            <p className="mt-2 text-sm text-med-text-sub">
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button
                variant="outline"
                disabled={cancelingId !== null}
                onClick={() => setAppointmentToCancel(null)}
              >
                Volver
              </Button>

              <Button
                disabled={cancelingId !== null}
                onClick={handleConfirmCancel}
              >
                {cancelingId !== null ? 'Cancelando...' : 'Sí, cancelar turno'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
