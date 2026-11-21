import { instance } from '../../shared/api/axiosInstance';

// Consultar los turnos del paciente autenticado.
export const getPatientAppointments = async () => {
  const response = await instance.get('api/appointments/patient');

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
  const response = await instance.get(`api/availabilities/${doctorId}/slots`, {
    params: {
      pageSize: 100,
      pageIndex: 1,
      ...(date ? { date } : {}),
    },
  });

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

// Obtener los turnos de una fecha para el tablero administrativo.
export const getAppointmentsByDate = async (date) => {
  const response = await instance.get('/api/appointments', {
    params: {
      date,
      pageSize: 100,
      pageIndex: 1,
    },
  });

  return response.data;
};

// Cancelar una reserva.
export const cancelAppointment = async (appointmentId) => {
  const response = await instance.delete(`api/appointments/${appointmentId}`);

  return response.data;
};

// Buscar citas desde el panel del administrador.
export const getAppointments = async ({
  specialtyId = null,
  doctorId = null,
  dni = null,
  date = '',
  pageSize = 10,
  pageIndex = 1,
} = {}) => {
  const response = await instance.get('api/appointments/search', {
    params: {
      pageSize,
      pageIndex,
      ...(specialtyId ? { specialtyId } : {}),
      ...(doctorId ? { doctorId } : {}),
      ...(dni ? { dni } : {}),
      ...(date ? { date } : {}),
    },
  });

  return response.data;
};
