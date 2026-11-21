import { useRef, useState } from 'react';
import { createAppointment } from '../../appointments/services/appointmentService';

function usePatientBooking() {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedModal, setConfirmedModal] = useState(false);

  const bookingInProgressRef = useRef(false);

  const handleConfirmAppointment = async ({
    currentDoctor,
    selectedDoctorId,
    searchedDoctorId,
    selectedSlot,
    reason,
  }) => {
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

  return {
    bookingLoading,
    bookingError,
    setBookingError,
    confirmedModal,
    setConfirmedModal,
    handleConfirmAppointment,
  };
}

export default usePatientBooking;
