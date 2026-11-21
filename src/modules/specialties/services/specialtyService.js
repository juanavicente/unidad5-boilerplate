import { instance } from '../../shared/api/axiosInstance';

// Obtener todas las especialidades
export const getSpecialties = async (
  pageSize = 10,
  pageIndex = 1,
  name = ''
) => {
  const response = await instance.get('/api/specialties', {
    params: { pageSize, pageIndex, name },
  });

  return response.data;
};

// Obtener una especialidad por ID
export const getSpecialtyById = async (id) => {
  const response = await instance.get(`/api/specialties/${id}`);
  return response.data;
};

// Registrar una nueva especialidad
export const createSpecialty = async (specialty) => {
  const response = await instance.post('/api/specialties', specialty);
  return response.data;
};

// Editar una especialidad
export const updateSpecialty = async (id, specialty) => {
  const response = await instance.put(
    `/api/specialties/${id}`,
    specialty
  );

  return response.data;
};

// Desactivar una especialidad (baja lógica)
export const deleteSpecialty = async (id) => {
  const response = await instance.delete(`/api/specialties/${id}`);
  return response.data;
};