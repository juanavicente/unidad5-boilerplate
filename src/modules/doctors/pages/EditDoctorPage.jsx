import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import { mockDoctors } from '../data/mockDoctors';

function EditDoctorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const doctor = mockDoctors.find((doc) => doc.id === id);
  const [name, setName] = useState(doctor?.name ?? '');
  const [specialtyId, setSpecialtyId] = useState(doctor?.specialtyId ?? '');
  const [licenseNumber, setLicenseNumber] = useState(
  doctor?.licenseNumber ?? ''
  );

  const handleSubmit = (e) => {
  e.preventDefault();
  setError('');

  if (!name.trim()) {
    setError('Debe ingresar el nombre completo del doctor.');
    return;
  }

  if (!specialtyId) {
    setError('Debe seleccionar una especialidad.');
    return;
  }

  if (!licenseNumber.trim()) {
    setError('Debe ingresar el número de licencia médica.');
    return;
  }

  // El guardado real se conectará con la API.
  alert('Datos válidos. Pendiente de conexión con el backend.');
};

  return (
  <div className="flex flex-col gap-6">
    <div className="text-sm text-med-text-sub">
      <button
        type="button"
        onClick={() => navigate('/admin/doctors')}
        className="hover:text-med-primary-700"
      >
        Doctores
      </button>

      <span className="mx-2">›</span>
      <span className="font-semibold text-med-primary-900">
        Editar Doctor
      </span>
    </div>

    {!doctor ? (
      <p className="text-red-600">
        No se encontró el médico seleccionado.
      </p>
    ) : (
      <Card className="border-med-border overflow-hidden">
        <div className="border-b border-med-border pb-5">
          <h1 className="text-xl font-bold text-med-primary-900">
            Editar Doctor
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Modifique los datos del profesional seleccionado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
          <div>
            <label
              htmlFor="edit-name"
              className="block text-sm font-semibold text-med-text-main mb-2"
            >
              Nombre Completo del Doctor
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-med-border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="edit-specialty"
                className="block text-sm font-semibold text-med-text-main mb-2"
              >
                Especialidad
              </label>
              <select
                id="edit-specialty"
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                className="w-full px-4 py-3 border border-med-border rounded-lg"
              >
                <option value="">Seleccione especialidad</option>
                <option value="1">Cardiología Clínica</option>
                <option value="2">Pediatría Avanzada</option>
                <option value="3">Neurocirugía</option>
                <option value="4">Ginecología</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-license"
                className="block text-sm font-semibold text-med-text-main mb-2"
              >
                Número de Licencia Médica
              </label>
              <input
                id="edit-license"
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-3 border border-med-border rounded-lg"
              />
            </div>
          </div>
        {error && (
        <div
            role="alert"
            className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
            {error}
        </div>
        )}

          <div className="flex justify-end gap-3 pt-5 border-t border-med-border">
            <button
              type="button"
              onClick={() => navigate('/admin/doctors')}
              style={{
                backgroundColor: '#ffffff',
                color: '#12395b',
                border: '1px solid #d9e2ec',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-3 rounded-lg bg-med-primary-900 text-white font-medium"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </Card>
    )}
  </div>
);
}

export default EditDoctorPage;