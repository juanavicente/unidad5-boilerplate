import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

import AvailabilityItem from './AvailabilityItem';

const WEEK_DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

// Generar los valores iniciales de los siete días.
const createDefaultValues = (initialValues = []) => ({
  days: WEEK_DAYS.map((day) => {
    const availability = initialValues?.find((item) => item.day === day);

    return {
      day,
      enabled: Boolean(availability),
      startTime: availability?.startTime || '',
      endTime: availability?.endTime || '',
    };
  }),
});

function AvailabilityForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Guardar Disponibilidad',
  initialValues = null,
  selectedDoctor = '',
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: createDefaultValues(),
  });

  // Actualizar el formulario cuando se cargan disponibilidades.
  useEffect(() => {
    reset(createDefaultValues(initialValues || []));
  }, [initialValues, reset]);

  // Cancelar y recuperar los valores originales.
  const handleCancel = () => {
    reset(createDefaultValues(initialValues || []));
    clearErrors();
  };

  // Validar y preparar los datos.
  const handleFormSubmit = (data) => {
    const enabledDays = data.days.filter((item) => item.enabled);

    if (enabledDays.length === 0) {
      setError('root', {
        message: 'Debés seleccionar al menos un día de atención.',
      });

      return;
    }

    const invalidDay = enabledDays.find((item) => {
      return !item.startTime || !item.endTime || item.startTime >= item.endTime;
    });

    if (invalidDay) {
      setError('root', {
        message:
          'Verificá los horarios: la entrada debe ser anterior a la salida.',
      });

      return;
    }

    clearErrors();

    onSubmit({
      days: enabledDays.map((item) => ({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
      })),
    });
  };

  return (
    <Card className="p-0 overflow-hidden">
      {/* Encabezado */}
      <div className="p-5 border-b border-med-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-med-primary-900">
            Configuración de Horarios
          </h2>

          <p className="text-xs text-med-text-muted mt-1">
            Definí los días y rangos horarios de atención.
          </p>
        </div>

        <span className="text-xs text-med-text-muted flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-med-primary-600" />
          Intervalos automáticos de 30 minutos
        </span>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Tabla semanal */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-5 py-3.5">Día</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5">Entrada</th>
                <th className="px-5 py-3.5">Salida</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-med-border-subtle">
              {WEEK_DAYS.map((day, index) => (
                <AvailabilityItem
                  key={day}
                  day={day}
                  index={index}
                  register={register}
                  control={control}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Errores de validación */}
        {errors.root && (
          <div
            role="alert"
            className="mx-5 mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs"
          >
            {errors.root.message}
          </div>
        )}

        {/* Botones */}
        <div className="p-5 border-t border-med-border flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={!selectedDoctor || isSubmitting}>
            {isSubmitting ? 'Guardando...' : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AvailabilityForm;
