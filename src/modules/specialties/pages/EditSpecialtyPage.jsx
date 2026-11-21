import { useEffect, useState } from 'react';
import {
  getSpecialtyById,
  updateSpecialty,
} from '../services/specialtyService';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function EditSpecialtyPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [specialty, setSpecialty] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  const loadSpecialty = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getSpecialtyById(id);

      setSpecialty(data);
      setName(data.name ?? '');
      setDescription(data.description ?? '');
    } catch (err) {
      console.error('Error al cargar especialidad:', err);
      setError('No se pudo cargar la especialidad.');
    } finally {
      setLoading(false);
    }
  };

    loadSpecialty();
  }, [id]);

  const handleSubmit = async (e) => {
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

  try {
    setSaving(true);

    const updatedSpecialty = {
      name: name.trim(),
      description: description.trim(),
    };

    await updateSpecialty(id, updatedSpecialty);

    alert('¡Especialidad actualizada correctamente!');

    navigate('/admin/specialties');
  } catch (err) {
    console.error('Error al actualizar especialidad:', err);

    setError(
      err.response?.data?.message ||
      'No se pudo actualizar la especialidad. Intente nuevamente.'
    );
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <p className="p-6 text-med-text-sub">
        Cargando datos de la especialidad...
      </p>
    );
  }

  if (!specialty) {
    return (
      <div className="flex flex-col gap-4">
      <p className="text-red-600">
        {error || 'No se encontró la especialidad seleccionada.'}
      </p>

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
              disabled={saving}
              className="bg-med-primary-900 hover:bg-med-primary-800 text-white"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EditSpecialtyPage;