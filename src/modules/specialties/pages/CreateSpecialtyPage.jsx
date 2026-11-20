import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function CreateSpecialtyPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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

    // Pendiente: conectar con createSpecialty()
    alert('Formulario válido. Pendiente de conexión con el backend.');
  };

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
      <span>Agregar Nueva Especialidad</span>
    </div>

    {/* Encabezado fuera de la tarjeta */}
    <div>
      <h1 className="text-xl font-bold text-med-primary-900">
        Registrar Nueva Especialidad
      </h1>

      <p className="mt-1 text-sm text-med-text-sub">
        Complete la información técnica y administrativa para dar
        de alta una especialidad médica en el sistema hospitalario.
      </p>
    </div>

    {/* Tarjeta principal */}
    <Card className="border-med-border">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Nombre */}
        <div>
          <label
            htmlFor="specialty-name"
            className="block text-sm font-medium text-med-text-main mb-2"
          >
            Nombre de la Especialidad
          </label>

          <input
            id="specialty-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Cardiología Intervencionista"
            className="w-full px-4 py-3 border border-med-border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="specialty-description"
            className="block text-sm font-medium text-med-text-main mb-2"
          >
            Descripción
          </label>

          <textarea
            id="specialty-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalle el alcance de la especialidad, procedimientos principales y requisitos de derivación..."
            rows={5}
            className="w-full px-4 py-3 border border-med-border rounded-md bg-white resize-none focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          />
        </div>

        {/* Estado inicial */}
        <div>
          <label
            htmlFor="specialty-status"
            className="block text-sm font-medium text-med-text-main mb-2"
          >
            Estado inicial
          </label>

          <select
            id="specialty-status"
            value="active"
            disabled
            className="w-full px-4 py-3 border border-med-border rounded-md bg-gray-50 text-med-text-main"
          >
            <option value="active">
              Activo - Disponible para programación
            </option>
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
            Guardar Especialidad
          </Button>
        </div>

      </form>
    </Card>
  </div>
);
}

export default CreateSpecialtyPage;