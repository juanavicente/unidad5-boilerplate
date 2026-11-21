
import { instance } from '../../shared/api/axiosInstance';

// Consultar los turnos del paciente autenticado.
export const getPatientAppointments = async () => {
  const response = await instance.get('api/appointments/patient');
  return response.data;
};

// Obtener especialidades activas.
export const getSpecialties = async () => {
  const response = await instance.get('api/specialties', {
    params: { pageSize: 100, pageIndex: 1 },
  });
  return response.data;
};

// Obtener médicos activos, opcionalmente filtrados por especialidad.
export const getDoctors = async (specialtyId = null) => {
  const response = await instance.get('api/doctors', {
    params: {
      pageSize: 100,
      pageIndex: 1,
      ...(specialtyId ? { specialtyId } : {}),
    },
  });
  return response.data;
};

// Obtener los horarios disponibles de un médico.
export const getAvailableSlots = async (doctorId, date = null) => {
  const response = await instance.get(
    `api/availabilities/${doctorId}/slots`,
    {
      params: {
        pageSize: 100,
        pageIndex: 1,
        ...(date ? { date } : {}),
      },
    }
  );
  return response.data;
};

// Crear una reserva.
export const createAppointment = async ({
  doctorId,
  availabilitySlotId,
  patientDni,
  reason,
}) => {
  const response = await instance.post('api/appointments', {
    doctorId,
    availabilitySlotId,
    patient: { dni: Number(patientDni) },
    reason,
  });
  return response.data;
};

// Cancelar una reserva.
export const cancelAppointment = async (appointmentId) => {
  const response = await instance.delete(
    `api/appointments/${appointmentId}`
  );
  return response.data;
};
