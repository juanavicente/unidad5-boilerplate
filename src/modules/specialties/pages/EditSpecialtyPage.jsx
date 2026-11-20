import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

// Datos simulados hasta conectar el backend
const mockSpecialties = [
  {
    id: '1',
    name: 'Cardiología',
    description:
      'Estudio y tratamiento de trastornos del corazón y del sistema circulatorio.',
    isActive: true,
  },
  {
    id: '2',
    name: 'Neurología',
    description:
      'Diagnóstico y tratamiento de todas las categorías de afecciones cerebrales.',
    isActive: true,
  },
  {
    id: '3',
    name: 'Dermatología',
    description:
      'Atención integral de enfermedades de la piel, uñas y cabello.',
    isActive: false,
  },
  {
    id: '4',
    name: 'Pediatría',
    description: 'Cuidado médico de lactantes, niños y adolescentes.',
    isActive: true,
  },
];

function EditSpecialtyPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const specialty = mockSpecialties.find(
    (item) => item.id === id
  );

  const [name, setName] = useState(specialty?.name ?? '');
  const [description, setDescription] = useState(
    specialty?.description ?? ''
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Debe ingresar el nombre de la especialidad.');
      return;
    }

    if (!description.trim()) {
      setError('Debe ingresar una descripción.');
      return;
    }

    alert(
      'Datos válidos. La actualización se realizará al conectar el backend.'
    );
  };

  if (!specialty) {
    return (
      <div className="flex flex-col gap-4">
        <p>No se encontró la especialidad seleccionada.</p>

        <button
          type="button"
          onClick={() => navigate('/admin/specialties')}
          className="text-med-primary-700"
        >
          Volver al directorio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="text-xs text-med-text-sub">
        <button
          type="button"
          onClick={() => navigate('/admin/specialties')}
          className="hover:text-med-primary-700"
        >
          Especialidades
        </button>

        <span className="mx-3">›</span>
        <span>Editar Especialidad</span>
      </div>

      {/* Encabezado */}
      <div>
        <h1 className="text-xl font-bold text-med-primary-900">
          Editar Especialidad
        </h1>

        <p className="mt-1 text-sm text-med-text-sub">
          Modifique la información técnica y administrativa de la
          especialidad médica seleccionada.
        </p>
      </div>

      {/* Formulario */}
      <Card className="border-med-border">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          {/* Nombre */}
          <div>
            <label
              htmlFor="edit-specialty-name"
              className="block text-sm font-medium text-med-text-main mb-2"
            >
              Nombre de la Especialidad
            </label>

            <input
              id="edit-specialty-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-med-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="edit-specialty-description"
              className="block text-sm font-medium text-med-text-main mb-2"
            >
              Descripción
            </label>

            <textarea
              id="edit-specialty-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-med-border rounded-md bg-white resize-none focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Estado actual */}
          <div>
            <label
              htmlFor="edit-specialty-status"
              className="block text-sm font-medium text-med-text-main mb-2"
            >
              Estado actual
            </label>

            <select
              id="edit-specialty-status"
              value={specialty.isActive ? 'active' : 'inactive'}
              disabled
              className="w-full px-4 py-3 border border-med-border rounded-md bg-gray-50 text-med-text-main"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          {/* Errores */}
          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-5 border-t border-med-border">
            <button
              type="button"
              onClick={() => navigate('/admin/specialties')}
              style={{
                backgroundColor: '#ffffff',
                color: '#12395b',
                border: '1px solid #d9e2ec',
                padding: '12px 20px',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

            <Button
              type="submit"
              className="bg-med-primary-900 hover:bg-med-primary-800 text-white"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EditSpecialtyPage;