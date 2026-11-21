import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import {
  getDoctors,
  getAvailableSlots,
  createAppointment,
} from '../../appointments/services/appointmentService';
import { getSpecialties } from '../../specialties/services/specialtyService';

function formatLocalDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatTime(time) {
  return time ? time.slice(0, 5) : '--:--';
}

function PatientHome() {
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [searchedDoctorId, setSearchedDoctorId] = useState('');

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [reason, setReason] = useState('');
  const [confirmedModal, setConfirmedModal] = useState(false);

  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const bookingInProgressRef = useRef(false);

  const [pageError, setPageError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');

  const [weekOffset, setWeekOffset] = useState(0);
  const [searchVersion, setSearchVersion] = useState(0);

  // Construir los días hábiles de la semana seleccionada.

  // Construir la semana completa: lunes a domingo.
  const weekDays = useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;

    const monday = new Date(today);

    monday.setHours(12, 0, 0, 0);
    monday.setDate(today.getDate() - dayOfWeek + weekOffset * 7);

    const todayIso = formatLocalDate(today);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + index);

      return {
        dayName: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'][index],
        dateNumber: String(date.getDate()),
        fullDate: date.toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        isoDate: formatLocalDate(date),
      };
    }).filter((day) => day.isoDate >= todayIso);
  }, [weekOffset]);

  const todayIso = formatLocalDate(new Date());

  const firstFutureDay =
    weekDays.find((day) => day.isoDate >= todayIso) || weekDays[0];

  // Cargar especialidades desde el backend.
  useEffect(() => {
    let active = true;

    const loadSpecialties = async () => {
      try {
        setLoadingSpecialties(true);
        setPageError('');

        const response = await getSpecialties(100, 1);

        if (!active) return;

        const items = response?.data || [];

        setSpecialties(items);

        if (items.length > 0) {
          setSelectedSpecialty(String(items[0].id));
        }
      } catch (error) {
        if (active) {
          setPageError(
            error?.response?.data?.message ||
              'No se pudieron cargar las especialidades.'
          );
        }
      } finally {
        if (active) {
          setLoadingSpecialties(false);
        }
      }
    };

    loadSpecialties();

    return () => {
      active = false;
    };
  }, []);

  // Cargar médicos cuando cambia la especialidad.
  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      if (!selectedSpecialty) {
        setDoctors([]);
        setSelectedDoctorId('');

        return;
      }

      try {
        setLoadingDoctors(true);
        setDoctors([]);
        setSelectedDoctorId('');
        setSearchedDoctorId('');
        setAvailableSlots([]);
        setSelectedSlot(null);
        setSelectedDate('');

        const response = await getDoctors(selectedSpecialty);

        if (!active) return;

        const items = response?.data || [];

        setDoctors(items);

        if (items.length > 0) {
          setSelectedDoctorId(String(items[0].id));
        }
      } catch (error) {
        if (active) {
          setPageError(
            error?.response?.data?.message ||
              'No se pudieron cargar los médicos.'
          );
        }
      } finally {
        if (active) {
          setLoadingDoctors(false);
        }
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, [selectedSpecialty]);

  // Cargar disponibilidad para los días visibles de la semana.
  useEffect(() => {
    let active = true;

    const loadAvailability = async () => {
      if (!searchedDoctorId) {
        setAvailableSlots([]);

        return;
      }

      try {
        setLoadingSlots(true);
        setAvailabilityError('');
        setAvailableSlots([]);

        const responses = await Promise.all(
          weekDays.map((day) =>
            getAvailableSlots(searchedDoctorId, day.isoDate)
          )
        );

        if (!active) return;

        const slots = responses.flatMap((response) =>
          (response?.data || []).map((slot) => ({
            id: slot.id,
            date: slot.slotDate,
            time: formatTime(slot.startTime),
            startTime: slot.startTime,
            endTime: slot.endTime,
          }))
        );

        setAvailableSlots(slots);
      } catch (error) {
        if (active) {
          setAvailabilityError(
            error?.response?.data?.message ||
              'No se pudo consultar la disponibilidad. Intentá nuevamente.'
          );
        }
      } finally {
        if (active) {
          setLoadingSlots(false);
        }
      }
    };

    loadAvailability();

    return () => {
      active = false;
    };
  }, [searchedDoctorId, weekDays, searchVersion]);

  const currentDoctor = doctors.find(
    (doctor) => String(doctor.id) === selectedDoctorId
  );

  const selectedDayObj = weekDays.find((day) => day.isoDate === selectedDate);

  const slotsByDay = Object.fromEntries(
    weekDays.map((day) => [
      day.isoDate,
      availableSlots.filter((slot) => slot.date === day.isoDate),
    ])
  );

  const handleSearchAvailability = () => {
    if (!selectedDoctorId) {
      setAvailabilityError('Seleccioná un médico antes de buscar.');

      return;
    }

    setAvailabilityError('');
    setSelectedSlot(null);
    setSelectedDate(firstFutureDay.isoDate);
    setSearchedDoctorId(selectedDoctorId);
    setSearchVersion((previous) => previous + 1);
  };

  const handleSelectSlot = (slot) => {
    setSelectedDate(slot.date);
    setSelectedSlot(slot);
    setBookingError('');
  };

  const handleChangeWeek = (direction) => {
    setWeekOffset((previous) => Math.max(0, previous + direction));

    setSelectedSlot(null);
    setSelectedDate('');
  };

  const handleConfirmAppointment = async () => {
    // Evita solicitudes duplicadas incluso antes de que React actualice el estado.
    if (bookingInProgressRef.current) return;

    setBookingError('');

    if (!currentDoctor || searchedDoctorId !== selectedDoctorId) {
      setBookingError(
        'Primero seleccioná un médico y consultá su disponibilidad.'
      );

      return;
    }

    if (!selectedSlot) {
      setBookingError('Seleccioná un horario disponible.');

      return;
    }

    if (!reason.trim()) {
      setBookingError('Ingresá el motivo de la consulta.');

      return;
    }

    const patientDni = sessionStorage.getItem('patientDni');

    if (!patientDni) {
      setBookingError(
        'No se encontró la información de tu sesión. Cerrá sesión e ingresá nuevamente.'
      );

      return;
    }

    try {
      bookingInProgressRef.current = true;
      setBookingLoading(true);

      await createAppointment({
        doctorId: currentDoctor.id,
        availabilitySlotId: selectedSlot.id,
        patientDni,
        reason: reason.trim(),
      });

      setConfirmedModal(true);
    } catch (error) {
      const status = error?.response?.status;

      if (status === 409) {
        setBookingError(
          'Ese horario acaba de ser reservado por otra persona. Buscá otro disponible.'
        );
      } else {
        setBookingError(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            'No se pudo confirmar el turno. Verificá los datos e intentá nuevamente.'
        );
      }
    } finally {
      bookingInProgressRef.current = false;
      setBookingLoading(false);
    }
  };

  const specialtyName = currentDoctor?.specialty?.name || 'Especialidad médica';

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* 1. Selector de especialidad y médico */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        {pageError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {pageError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Especialidad
            </label>

            <select
              value={selectedSpecialty}
              disabled={loadingSpecialties || specialties.length === 0}
              onChange={(event) => {
                setSelectedSpecialty(event.target.value);
                setBookingError('');
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-100"
            >
              <option value="">
                {loadingSpecialties
                  ? 'Cargando especialidades...'
                  : specialties.length === 0
                    ? 'No hay especialidades disponibles'
                    : 'Seleccione una especialidad'}
              </option>

              {specialties.map((specialty) => (
                <option key={specialty.id} value={String(specialty.id)}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-med-text-sub">
              Seleccionar Médico
            </label>

            <select
              value={selectedDoctorId}
              disabled={loadingDoctors || doctors.length === 0}
              onChange={(event) => {
                setSelectedDoctorId(event.target.value);
                setSearchedDoctorId('');
                setAvailableSlots([]);
                setSelectedSlot(null);
                setSelectedDate('');
                setBookingError('');
                setAvailabilityError('');
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-100"
            >
              <option value="">
                {loadingDoctors
                  ? 'Cargando médicos...'
                  : doctors.length === 0
                    ? 'No hay médicos disponibles'
                    : 'Seleccione un médico'}
              </option>

              {doctors.map((doctor) => (
                <option key={doctor.id} value={String(doctor.id)}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2.5 rounded-lg shadow-sm"
              onClick={handleSearchAvailability}
            >
              <span>Buscar Disponibilidad</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Información del médico */}
      {currentDoctor && (
        <Card className="p-5 sm:p-6 flex items-center gap-4 border-med-border">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200 shrink-0">
            🩺
          </div>

          <div className="overflow-hidden">
            <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
              {currentDoctor.name}
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-med-primary-700 mt-0.5">
              {specialtyName}
            </p>

            <p className="text-xs text-med-text-muted mt-0.5">
              Profesional disponible para reservas
            </p>
          </div>
        </Card>
      )}

      {/* 3. Calendario de disponibilidad */}
      <Card className="p-5 sm:p-6 border-med-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={weekOffset === 0}
              className="p-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition disabled:opacity-30"
              onClick={() => handleChangeWeek(-1)}
            >
              ‹
            </button>

            <span className="font-bold text-sm sm:text-base text-med-primary-900">
              {weekDays[0]?.fullDate} -{' '}
              {weekDays[weekDays.length - 1]?.fullDate}
            </span>

            <button
              type="button"
              className="p-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
              onClick={() => handleChangeWeek(1)}
            >
              ›
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-med-text-sub">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-med-primary-900" />
              Disponible
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Seleccionado
            </span>
          </div>
        </div>

        {availabilityError && (
          <p className="mt-4 text-sm text-red-600">{availabilityError}</p>
        )}

        {!searchedDoctorId && (
          <p className="py-12 text-center text-sm text-med-text-muted">
            Seleccioná un médico y presioná «Buscar Disponibilidad» para
            consultar sus horarios.
          </p>
        )}

        {searchedDoctorId && loadingSlots && (
          <p className="py-12 text-center text-sm text-med-text-muted">
            Consultando horarios disponibles...
          </p>
        )}

        {searchedDoctorId && !loadingSlots && (
          <>
            {/* Vista desktop */}
            <div className="hidden sm:grid sm:grid-cols-7 gap-2 pt-5">
              {weekDays.map((day) => {
                const slots = slotsByDay[day.isoDate] || [];

                return (
                  <div
                    key={day.isoDate}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="text-center">
                      <span className="text-[11px] font-bold text-med-text-sub uppercase">
                        {day.dayName}
                      </span>

                      <p className="text-xl font-bold text-med-primary-900 leading-tight">
                        {day.dateNumber}
                      </p>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      {slots.length > 0 ? (
                        slots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => handleSelectSlot(slot)}
                              className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                                isSelected
                                  ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                                  : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })
                      ) : (
                        <div className="h-32 flex items-center justify-center text-center p-2">
                          <p className="text-xs text-med-text-muted leading-relaxed">
                            No hay turnos disponibles.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista mobile */}
            <div className="block sm:hidden pt-4 space-y-4">
              <div>
                <span className="block text-xs font-bold text-med-text-main mb-2">
                  Próximos Turnos
                </span>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {weekDays.map((day) => {
                    const isActive = selectedDate === day.isoDate;

                    return (
                      <button
                        key={day.isoDate}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day.isoDate);
                          setSelectedSlot(null);
                        }}
                        className={`flex-1 min-w-[68px] py-2.5 px-2 rounded-xl text-center border transition-all ${
                          isActive
                            ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                            : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                        }`}
                      >
                        <span className="block text-[10px] font-bold uppercase">
                          {day.dayName}
                        </span>

                        <span className="block text-base font-extrabold my-0.5">
                          {day.dateNumber}
                        </span>

                        <span className="block text-[10px] uppercase">
                          {new Date(`${day.isoDate}T12:00:00`)
                            .toLocaleDateString('es-AR', {
                              month: 'short',
                            })
                            .toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-med-text-sub mb-2.5">
                  Horarios disponibles
                </span>

                {slotsByDay[selectedDate]?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {slotsByDay[selectedDate].map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                            isSelected
                              ? 'border-2 border-med-primary-900 bg-white text-med-primary-900 font-bold shadow-xs'
                              : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                          }`}
                        >
                          {slot.time} hs
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 border border-med-border rounded-xl text-center">
                    <p className="text-xs text-med-text-muted">
                      No hay turnos disponibles para este día seleccionado.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {availableSlots.length === 0 && (
              <p className="mt-4 text-xs text-med-text-muted text-center">
                No encontramos horarios disponibles para esta semana.
              </p>
            )}
          </>
        )}
      </Card>

      {/* 4. Motivo de consulta */}
      <Card className="p-5 sm:p-6 border-med-border">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reason"
            className="text-sm font-semibold text-med-primary-900"
          >
            Motivo de consulta
          </label>

          <textarea
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ej: Consulta de control general"
            rows={3}
            maxLength={500}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 resize-none"
          />

          <p className="text-xs text-med-text-muted">
            Ingrese brevemente el motivo de su consulta.
          </p>
        </div>
      </Card>

      {/* 5. Resumen y confirmación */}
      <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="border-l-4 border-med-primary-900 pl-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
            Resumen de Selección
          </span>

          <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
            <span>📅</span>

            <span>
              {selectedDayObj?.fullDate || 'Seleccione una fecha'},{' '}
              {selectedSlot?.time || '--:--'} HS
            </span>
          </p>

          <p className="text-xs text-med-text-sub mt-0.5">
            {currentDoctor?.name || 'Seleccione un médico'}
            {' • '}
            {specialtyName}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleConfirmAppointment}
          disabled={bookingLoading}
          aria-busy={bookingLoading}
          className={`flex items-center justify-center gap-2 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm shrink-0 ${
            bookingLoading
              ? 'bg-med-primary-700 opacity-70 cursor-not-allowed'
              : 'bg-med-primary-900 hover:bg-med-primary-800'
          }`}
        >
          <span>{bookingLoading ? 'Reservando...' : 'Confirmar Turno'}</span>
        </Button>
      </div>

      {bookingError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {bookingError}
        </div>
      )}

      {/* 6. Modal de confirmación */}
      {confirmedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>

            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno confirmado con éxito!
            </h3>

            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con{' '}
              <strong className="text-med-text-main">
                {currentDoctor?.name}
              </strong>{' '}
              fue reservado para el{' '}
              <strong className="text-med-text-main">
                {selectedDayObj?.fullDate} a las {selectedSlot?.time} hs.
              </strong>
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-2">
              <p>
                <strong>Especialidad:</strong> {specialtyName}
              </p>

              <p>
                <strong>Motivo:</strong> {reason}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={() => navigate('/appointments')}
              >
                Ver Mis Turnos
              </Button>

              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={() => {
                  setConfirmedModal(false);
                  setSelectedSlot(null);
                  setReason('');
                  setSearchedDoctorId('');
                  setAvailableSlots([]);
                  setSelectedDate('');
                  setBookingError('');
                }}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
