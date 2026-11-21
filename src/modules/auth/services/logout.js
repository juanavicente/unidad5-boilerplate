import { instance } from '../../shared/api/axiosInstance';

export const logout = async () => {
  const response = await instance.post('/api/auth/logout');

  return response.data;
};
