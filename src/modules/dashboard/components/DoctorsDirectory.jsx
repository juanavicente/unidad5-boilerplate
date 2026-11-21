function DoctorsDirectory({
  doctors,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  pageIndex,
  setPageIndex,
  total,
  totalPages,
  pageSize,
  onViewDoctor,
}) {
  const previewDoctors = doctors.map((doctor) => ({
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty?.name ?? 'Sin especialidad',
    avatar: '👨‍⚕️',
  }));

  return (
    <div className="overflow-hidden rounded-xl border border-med-border bg-white">
      {/* Cabecera y buscador */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-med-border">
        <h2 className="text-base font-bold text-med-primary-900">
          Directorio de Profesionales Médicos
        </h2>

        <div className="relative w-full sm:w-72">
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
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPageIndex(0);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-med-primary-50/70 border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
            <tr>
              <th className="px-6 py-3.5">Nombre del Doctor</th>
              <th className="px-6 py-3.5">Especialidad</th>
              <th className="px-6 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-med-border-subtle text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-8 text-center text-med-text-muted"
                >
                  Cargando médicos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : previewDoctors.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-8 text-center text-med-text-muted"
                >
                  No se encontraron médicos.
                </td>
              </tr>
            ) : (
              previewDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-med-primary-100 flex items-center justify-center text-lg">
                        {doctor.avatar}
                      </span>

                      <span className="font-semibold text-med-primary-900">
                        {doctor.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-med-text-sub">
                    {doctor.specialty}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewDoctor(doctor.id)}
                      className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-med-text-muted">
        <span>
          {total === 0
            ? 'No hay registros'
            : `Mostrando ${pageIndex * pageSize + 1} a ${Math.min(
                (pageIndex + 1) * pageSize,
                total
              )} de ${total} registros`}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageIndex((previous) => previous - 1)}
            disabled={pageIndex === 0 || loading}
            className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Página anterior"
          >
            ‹
          </button>

          <span>
            Página {total === 0 ? 0 : pageIndex + 1} de {totalPages}
          </span>

          <button
            onClick={() => setPageIndex((previous) => previous + 1)}
            disabled={pageIndex + 1 >= totalPages || loading}
            className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorsDirectory;
