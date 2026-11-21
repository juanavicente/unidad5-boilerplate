import { instance } from '../../shared/api/axiosInstance';

// Consultar disponibilidades de un médico
const getDoctorAvailabilities = async (doctorId) => {
  const response = await instance.get(
    `/api/doctors/${doctorId}/availabilities`
  );

  return response.data;
};

// Crea disponibilidades
const createAvailability = async (availabilityData) => {
  const response = await instance.post('/api/availabilities', availabilityData);

  return response.data;
};

// Actualiza disponibilidades
const updateAvailability = async (availabilityData) => {
  const response = await instance.put('/api/availabilities', availabilityData);

  return response.data;
};

export { getDoctorAvailabilities, createAvailability, updateAvailability };
