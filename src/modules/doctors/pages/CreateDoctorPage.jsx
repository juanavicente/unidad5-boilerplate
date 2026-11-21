import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSpecialties } from '../../specialties/services/specialtyService';
import { createDoctor } from '../services/doctorService';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function CreateDoctorPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await getSpecialties(100, 0);

        setSpecialties(response.data ?? []);
      } catch (err) {
        console.error('Error al cargar especialidades:', err);
        setError('No se pudieron cargar las especialidades.');
      }
    };

    loadSpecialties();
  }, []);

  const handleSubmit = async (e) => {
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

    try {
      setSaving(true);

      const doctor = {
        name: name.trim(),
        licenseNumber: licenseNumber.trim(),
        specialtyId: specialtyId,
      };

      await createDoctor(doctor);

      alert('¡Doctor registrado correctamente!');

      navigate('/admin/doctors');
    } catch (err) {
      console.error('Error al registrar médico:', err);

      setError(
        err.response?.data?.message ||
          'No se pudo registrar el médico. Intente nuevamente.'
      );
    } finally {
      setSaving(false);
    }
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
          Agregar Nuevo Doctor
        </span>
      </div>

      <Card className="border-med-border overflow-hidden">
        <div className="border-b border-med-border pb-5">
          <h1 className="text-xl font-bold text-med-primary-900">
            Registrar Nuevo Doctor
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Complete todos los campos obligatorios para integrar al nuevo
            facultativo al sistema del centro médico.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
          <div>
            <label
              htmlFor="doctor-name"
              className="block text-sm font-semibold text-med-text-main mb-2"
            >
              Nombre Completo del Doctor
            </label>
            <input
              id="doctor-name"
              type="text"
              placeholder="Ej: Dr. Alejandro Martínez"
              className="w-full px-4 py-3 border border-med-border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="doctor-specialty"
                className="block text-sm font-semibold text-med-text-main mb-2"
              >
                Especialidad
              </label>
              <select
                id="doctor-specialty"
                className="w-full px-4 py-3 border border-med-border rounded-lg"
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
              >
                <option value="">Seleccione especialidad</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="doctor-license"
                className="block text-sm font-semibold text-med-text-main mb-2"
              >
                Número de Licencia Médica
              </label>
              <input
                id="doctor-license"
                type="text"
                placeholder="ID-45920-X"
                className="w-full px-4 py-3 border border-med-border rounded-lg"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
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
            <Button
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
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="bg-med-primary-900 text-white"
            >
              {saving ? 'Guardando...' : 'Guardar Doctor'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateDoctorPage;
