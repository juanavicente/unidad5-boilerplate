import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoctorById } from '../services/doctorService';

function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getDoctorById(id);

        setDoctor(data);
      } catch (err) {
        console.error('Error al cargar médico:', err);
        setError('No se pudo cargar la información del médico.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  if (loading) {
    return <p className="p-6">Cargando información del médico...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!doctor) {
    return <p className="p-6">No se encontró el médico seleccionado.</p>;
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
          <span className="text-4xl">👨‍⚕️</span>

          <div>
            <h2 className="text-xl font-bold text-med-primary-900">
              {doctor.name}
            </h2>
            <p className="text-sm text-med-text-sub">
              {doctor.specialty?.name ?? 'Sin especialidad'}
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
