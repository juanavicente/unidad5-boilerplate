import { useEffect, useState } from 'react';
import {
  getSpecialties,
  getDoctors,
} from '../../appointments/services/appointmentService';

function usePatientCatalog({
  setSearchedDoctorId,
  setSelectedSlot,
  setSelectedDate,
}) {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [pageError, setPageError] = useState('');

  // Cargar especialidades desde el backend.
  useEffect(() => {
    let active = true;

    const loadSpecialties = async () => {
      try {
        setLoadingSpecialties(true);
        setPageError('');

        const response = await getSpecialties();

        if (!active) return;

        const items = response?.data || [];

        setSpecialties(items);
        setSelectedSpecialty(items.length > 0 ? String(items[0].id) : '');
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
      setPageError('');

      if (!selectedSpecialty) {
        setDoctors([]);
        setSelectedDoctorId('');
        setSearchedDoctorId('');
        setSelectedSlot(null);
        setSelectedDate('');
        setLoadingDoctors(false);

        return;
      }

      try {
        setLoadingDoctors(true);
        setDoctors([]);
        setSelectedDoctorId('');
        setSearchedDoctorId('');
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
  }, [
    selectedSpecialty,
    setSearchedDoctorId,
    setSelectedSlot,
    setSelectedDate,
  ]);

  return {
    specialties,
    doctors,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedDoctorId,
    setSelectedDoctorId,
    loadingSpecialties,
    loadingDoctors,
    pageError,
  };
}

export default usePatientCatalog;
