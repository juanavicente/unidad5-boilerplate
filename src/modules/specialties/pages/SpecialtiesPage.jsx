import { useEffect, useState } from 'react';
import { getSpecialties, deleteSpecialty } from '../services/specialtyService';
import TablePagination from '../../shared/components/TablePagination';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import DeactivateSpecialtyModal from '../components/DeactivateSpecialtyModal';

function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [specialtyToDeactivate, setSpecialtyToDeactivate] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pageIndex, setPageIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (location.state?.successMessage) {
      setMessage(location.state.successMessage);
      setMessageType('success');

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location.state, location.pathname, navigate]);
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getSpecialties(
          pageSize,
          pageIndex + 1,
          searchTerm
        );

        setSpecialties(response.data ?? []);
        setTotal(response.total ?? 0);
      } catch (err) {
        console.error('Error al cargar especialidades:', err);
        setError('No se pudieron cargar las especialidades.');
      } finally {
        setLoading(false);
      }
    };

    loadSpecialties();
  }, [pageIndex, searchTerm, refreshKey]);

  const specialtiesList = specialties.map((specialty) => ({
    id: specialty.id,
    name: specialty.name,
    description: specialty.description ?? '',
    status: specialty.isActive ? 'Active' : 'Inactive',
    icon: '🏥',
  }));

  const filteredSpecialties = specialtiesList;

  const handleDeactivate = (specialty) => {
    setMessage('');

    if (specialty.status !== 'Active') {
      setMessage('Esta especialidad ya se encuentra inactiva.');
      setMessageType('warning');

      return;
    }

    setSpecialtyToDeactivate(specialty);
  };

  const confirmDeactivate = async () => {
    if (!specialtyToDeactivate) return;

    try {
      setMessage('');

      await deleteSpecialty(specialtyToDeactivate.id);

      setSpecialtyToDeactivate(null);

      const remainingTotal = Math.max(0, total - 1);
      const lastPageIndex = Math.max(
        0,
        Math.ceil(remainingTotal / pageSize) - 1
      );

      if (pageIndex > lastPageIndex) {
        setPageIndex(lastPageIndex);
      } else {
        setRefreshKey((previous) => previous + 1);
      }

      setMessage('Especialidad desactivada correctamente.');
      setMessageType('success');
    } catch (err) {
      console.error('Error al desactivar especialidad:', err);

      setMessage(
        err.response?.data?.message || 'No se pudo desactivar la especialidad.'
      );
      setMessageType('error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con Título, Buscador y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar especialidad..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(0);
              }}

              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          {/* Botón Nueva Especialidad */}
          <Button
            onClick={() => navigate('/admin/specialties/new')}
            className="flex items-center gap-1.5 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium"
          >
            <span>+</span>
            <span>Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-med-text-sub">Cargando especialidades...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {message && (
        <div
          role={messageType === 'error' ? 'alert' : 'status'}
          className={`p-3 rounded-lg border text-sm ${
            messageType === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : messageType === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Tabla Principal de Especialidades */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre de la Especialidad</th>
                <th className="px-6 py-3.5">Descripción</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {filteredSpecialties.map((spec) => (
                <tr
                  key={spec.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* Nombre con icono en caja celeste */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                        {spec.icon}
                      </div>
                      <span className="font-semibold text-med-primary-900">
                        {spec.name}
                      </span>
                    </div>
                  </td>

                  {/* Descripción */}
                  <td className="px-6 py-4 text-med-text-sub max-w-md">
                    {spec.description}
                  </td>

                  {/* Estado (Active / Inactive) */}
                  <td className="px-6 py-4 text-center">
                    {spec.status === 'Active' ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Inactivo
                      </span>
                    )}
                  </td>

                  {/* Acciones: Editar y Eliminar */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-med-text-muted">
                      <button
                        title="Editar especialidad"
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-text-muted hover:text-med-primary-900 transition"
                        onClick={() =>
                          navigate(`/admin/specialties/${spec.id}/edit`)
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>

                      <button
                        title="Eliminar especialidad"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                        onClick={() => handleDeactivate(spec)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginador normalizado idéntico a Búsqueda y Filtrado de Citas */}
        <TablePagination
          currentPage={pageIndex + 1}
          totalPages={Math.max(1, totalPages)}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={(page) => setPageIndex(page - 1)}
        />
      </Card>
      <DeactivateSpecialtyModal
        specialty={specialtyToDeactivate}
        onCancel={() => setSpecialtyToDeactivate(null)}
        onConfirm={confirmDeactivate}
      />
    </div>
  );
}

export default SpecialtiesPage;
