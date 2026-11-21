function DeactivateDoctorModal({ doctor, onCancel, onConfirm }) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-doctor-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2
          id="deactivate-doctor-title"
          className="text-xl font-bold text-med-primary-900"
        >
          Desactivar médico
        </h2>

        <p className="mt-3 text-sm text-med-text-sub">
          ¿Está seguro de que desea desactivar a <strong>{doctor.name}</strong>?
        </p>

        <p className="mt-2 text-sm text-med-text-muted">
          El médico dejará de estar activo en el sistema.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: '#ffffff',
              color: '#12395b',
              border: '1px solid #d9e2ec',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
          >
            Desactivar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeactivateDoctorModal;
