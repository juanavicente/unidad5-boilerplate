import { useMemo, useState } from 'react';

function formatLocalDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function useWeeklyCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);

  const todayIso = formatLocalDate(new Date());

  const weekDays = useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;

    const monday = new Date(today);

    monday.setHours(12, 0, 0, 0);
    monday.setDate(today.getDate() - dayOfWeek + weekOffset * 7);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + index);

      return {
        dayName: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'][index],
        dateNumber: String(date.getDate()),
        fullDate: date.toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        isoDate: formatLocalDate(date),
      };
    }).filter((day) => day.isoDate >= todayIso);
  }, [weekOffset, todayIso]);

  const firstFutureDay =
    weekDays.find((day) => day.isoDate >= todayIso) || weekDays[0];

  const changeWeek = (direction) => {
    setWeekOffset((previous) => Math.max(0, previous + direction));
  };

  return {
    weekOffset,
    weekDays,
    todayIso,
    firstFutureDay,
    changeWeek,
  };
}

export default useWeeklyCalendar;
