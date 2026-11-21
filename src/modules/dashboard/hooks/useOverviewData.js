import { useEffect, useState } from 'react';
import { getSpecialties } from '../../specialties/services/specialtyService';
import { getDoctors } from '../../doctors/services/doctorService';
import { getAppointmentsByDate } from '../../appointments/services/appointmentService';

const PAGE_SIZE = 3;

function useOverviewData() {
  // Datos del directorio
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [total, setTotal] = useState(0);

  // Métrica de médicos activos
  const [activeDoctors, setActiveDoctors] = useState(0);
  const [loadingActiveDoctors, setLoadingActiveDoctors] = useState(true);
  const [activeDoctorsError, setActiveDoctorsError] = useState(false);

  // Métrica de especialidades activas
  const [activeSpecialties, setActiveSpecialties] = useState(0);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [specialtiesError, setSpecialtiesError] = useState(false);

  // Métrica de turnos confirmados
  const [confirmedAppointments, setConfirmedAppointments] = useState(0);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(false);

  // Cargar médicos del directorio según búsqueda y página
  useEffect(() => {
    let isMounted = true;

    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setDoctorsError('');

        const response = await getDoctors(PAGE_SIZE, pageIndex, searchTerm);

        if (isMounted) {
          setDoctors(response.data ?? []);
          setTotal(response.total ?? 0);
        }
      } catch (error) {
        console.error('Error al cargar médicos del tablero:', error);

        if (isMounted) {
          setDoctorsError('No se pudieron cargar los médicos.');
        }
      } finally {
        if (isMounted) {
          setLoadingDoctors(false);
        }
      }
    };

    loadDoctors();

    return () => {
      isMounted = false;
    };
  }, [pageIndex, searchTerm]);

  // Cargar total de médicos activos sin depender de la búsqueda
  useEffect(() => {
    let isMounted = true;

    const loadActiveDoctors = async () => {
      try {
        setLoadingActiveDoctors(true);
        setActiveDoctorsError(false);

        const response = await getDoctors(1, 0, '');

        if (isMounted) {
          setActiveDoctors(response.total ?? 0);
        }
      } catch (error) {
        console.error('Error al cargar médicos activos:', error);

        if (isMounted) {
          setActiveDoctorsError(true);
        }
      } finally {
        if (isMounted) {
          setLoadingActiveDoctors(false);
        }
      }
    };

    loadActiveDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  // Cargar total de especialidades
  useEffect(() => {
    let isMounted = true;

    const loadSpecialties = async () => {
      try {
        setLoadingSpecialties(true);
        setSpecialtiesError(false);

        const response = await getSpecialties(1, 1, '');

        if (isMounted) {
          setActiveSpecialties(response.total ?? 0);
        }
      } catch (error) {
        console.error('Error al cargar especialidades:', error);

        if (isMounted) {
          setSpecialtiesError(true);
        }
      } finally {
        if (isMounted) {
          setLoadingSpecialties(false);
        }
      }
    };

    loadSpecialties();

    return () => {
      isMounted = false;
    };
  }, []);

  // Cargar turnos confirmados del día actual
  useEffect(() => {
    let isMounted = true;

    const loadTodayAppointments = async () => {
      try {
        setLoadingAppointments(true);
        setAppointmentsError(false);

        // Obtener la fecha actual en hora local
        const today = new Date().toLocaleDateString('en-CA');

        const response = await getAppointmentsByDate(today);
        const appointments = response.data ?? [];

        // Contar solamente los turnos BOOKED
        const confirmed = appointments.filter(
          (appointment) => appointment.appointmentsStatus === 'BOOKED'
        );

        if (isMounted) {
          setConfirmedAppointments(confirmed.length);
        }
      } catch (error) {
        console.error('Error al cargar los turnos de hoy:', error);

        if (isMounted) {
          setAppointmentsError(true);
        }
      } finally {
        if (isMounted) {
          setLoadingAppointments(false);
        }
      }
    };

    loadTodayAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return {
    doctors,
    loadingDoctors,
    doctorsError,
    searchTerm,
    setSearchTerm,
    pageIndex,
    setPageIndex,
    total,
    totalPages,
    pageSize: PAGE_SIZE,

    activeDoctors,
    loadingActiveDoctors,
    activeDoctorsError,

    activeSpecialties,
    loadingSpecialties,
    specialtiesError,

    confirmedAppointments,
    loadingAppointments,
    appointmentsError,
  };
}

export default useOverviewData;
