import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import OverviewMetrics from '../components/OverviewMetrics';
import DoctorsDirectory from '../components/DoctorsDirectory';
import useOverviewData from '../hooks/useOverviewData';

function OverviewPage() {
  const navigate = useNavigate();

  const {
    doctors,
    loadingDoctors,
    doctorsError,
    searchTerm,
    setSearchTerm,
    pageIndex,
    setPageIndex,
    total,
    totalPages,
    pageSize,

    activeDoctors,
    loadingActiveDoctors,
    activeDoctorsError,

    activeSpecialties,
    loadingSpecialties,
    specialtiesError,

    confirmedAppointments,
    loadingAppointments,
    appointmentsError,
  } = useOverviewData();

  return (
    <div className="flex flex-col gap-8">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Vista General de Gestión
          </h1>

          <p className="text-sm text-med-text-sub mt-1">
            Configure el personal médico y las especialidades del departamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => navigate('/admin/doctors')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nuevo Doctor</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/admin/specialties')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <OverviewMetrics
        activeDoctors={activeDoctors}
        loadingActiveDoctors={loadingActiveDoctors}
        activeDoctorsError={activeDoctorsError}
        activeSpecialties={activeSpecialties}
        loadingSpecialties={loadingSpecialties}
        specialtiesError={specialtiesError}
        confirmedAppointments={confirmedAppointments}
        loadingAppointments={loadingAppointments}
        appointmentsError={appointmentsError}
      />

      {/* Directorio de profesionales médicos */}
      <Card className="p-0 overflow-hidden border-med-border">
        <DoctorsDirectory
          doctors={doctors}
          loading={loadingDoctors}
          error={doctorsError}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          total={total}
          totalPages={totalPages}
          pageSize={pageSize}
          onViewDoctor={(doctorId) => navigate(`/admin/doctors/${doctorId}`)}
        />
      </Card>
    </div>
  );
}

export default OverviewPage;
