import { instance } from '../../shared/api/axiosInstance';

// Obtener médicos con paginación y búsqueda
export const getDoctors = async (
  pageSize = 10,
  pageIndex = 1,
  name = ''
) => {
  const response = await instance.get('/api/doctors', {
    params: {
      pageSize,
      pageIndex,
      name,
    },
  });

  return response.data;
};

// Obtener un médico por ID
export const getDoctorById = async (id) => {
  const response = await instance.get(`/api/doctors/${id}`);
  return response.data;
};

// Registrar un médico
export const createDoctor = async (doctor) => {
  const response = await instance.post('/api/doctors', doctor);
  return response.data;
};

// Actualizar un médico
export const updateDoctor = async (id, doctor) => {
  const response = await instance.put(`/api/doctors/${id}`, doctor);
  return response.data;
};

// Desactivar un médico (baja lógica)
export const deleteDoctor = async (id) => {
  const response = await instance.delete(`/api/doctors/${id}`);
  return response.data;
};