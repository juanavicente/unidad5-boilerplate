import { useEffect, useState } from 'react';
import { getAvailableSlots } from '../../appointments/services/appointmentService';

function formatTime(time) {
  return time ? time.slice(0, 5) : '--:--';
}

function useWeeklyAvailability({ doctorId, weekDays, searchVersion }) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  useEffect(() => {
    let active = true;

    const loadAvailability = async () => {
      if (!doctorId) {
        setAvailableSlots([]);
        setLoadingSlots(false);
        setAvailabilityError('');

        return;
      }

      try {
        setLoadingSlots(true);
        setAvailabilityError('');
        setAvailableSlots([]);

        const responses = await Promise.all(
          weekDays.map((day) => getAvailableSlots(doctorId, day.isoDate))
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
  }, [doctorId, weekDays, searchVersion]);

  return {
    availableSlots,
    loadingSlots,
    availabilityError,
    setAvailabilityError,
  };
}

export default useWeeklyAvailability;
