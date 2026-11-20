import { useNavigate, useParams } from 'react-router-dom';
import { mockDoctors } from '../data/mockDoctors';

function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = mockDoctors.find((doc) => doc.id === id);

  if (!doctor) {
    return <p>No se encontró el médico seleccionado.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
            type="button"
            onClick={() => navigate('/admin/doctors')}
            className="inline-flex w-fit items-center gap-2 px-5 py-3 bg-med-primary-900 hover:bg-med-primary-800 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
            <span>←</span>
            <span>Volver al directorio</span>
        </button>
        <h1 className="mt-4 text-2xl font-bold text-med-primary-900">
          Detalle del Doctor
        </h1>
      </div>

      <div className="rounded-xl border border-med-border bg-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{doctor.avatar}</span>

          <div>
            <h2 className="text-xl font-bold text-med-primary-900">
              {doctor.name}
            </h2>
            <p className="text-sm text-med-text-sub">
              {doctor.specialty}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-sm text-med-text-sub">Matrícula</p>
            <p className="font-medium">{doctor.licenseNumber}</p>
          </div>

          <div>
            <p className="text-sm text-med-text-sub">Estado</p>
            <p className="font-medium">
              {doctor.isActive ? 'Activo' : 'Inactivo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetailPage;