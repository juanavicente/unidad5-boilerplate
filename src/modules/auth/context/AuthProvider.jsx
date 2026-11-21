import { createContext, useState } from 'react';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';
import { logout } from '../services/logout';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  const isAuthenticated = Boolean(token && role);

  const setAuthSession = (data, patientDni = null) => {
    if (!data?.token || !data?.role) {
      throw new Error(
        'La respuesta del servidor no contiene una sesión válida.'
      );
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    if (patientDni !== null) {
      sessionStorage.setItem('patientDni', String(patientDni));
    } else {
      sessionStorage.removeItem('patientDni');
    }

    setToken(data.token);
    setRole(data.role);
  };

  const singout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('No se pudo cerrar la sesión en el servidor:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      sessionStorage.removeItem('patientDni');

      setToken(null);
      setRole(null);
    }
  };

  const singinAdmin = async (email, password) => {
    try {
      const { data } = await loginAdmin(email, password);

      setAuthSession(data);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const singinPatient = async (email, dni) => {
    try {
      const { data } = await loginPatient(email, dni);

      setAuthSession(data, dni);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated,
        singinAdmin,
        singinPatient,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
