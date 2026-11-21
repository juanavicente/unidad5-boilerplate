import { useWatch } from 'react-hook-form';

function AvailabilityItem({ day, index, register, control }) {
  const enabled = useWatch({
    control,
    name: `days.${index}.enabled`,
    defaultValue: false,
  });

  return (
    <tr className="hover:bg-med-primary-50/30 transition-colors">
      <td className="px-5 py-3 font-medium text-med-text-main">{day}</td>

      <td className="px-5 py-3">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register(`days.${index}.enabled`)}
            className="sr-only peer"
          />

          <span className="relative w-9 h-5 rounded-full bg-gray-300 peer-checked:bg-med-primary-700 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-med-primary-600" />

          <span className="text-xs text-med-text-sub">
            {enabled ? 'Activo' : 'Inactivo'}
          </span>
        </label>
      </td>

      <td className="px-5 py-3">
        <input
          type="time"
          disabled={!enabled}
          {...register(`days.${index}.startTime`)}
          className="w-full min-w-[115px] border border-med-border rounded-lg px-3 py-2.5 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400"
        />
      </td>

      <td className="px-5 py-3">
        <input
          type="time"
          disabled={!enabled}
          {...register(`days.${index}.endTime`)}
          className="w-full min-w-[115px] border border-med-border rounded-lg px-3 py-2.5 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400"
        />
      </td>
    </tr>
  );
}

export default AvailabilityItem;
