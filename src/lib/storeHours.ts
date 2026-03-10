export type StoreStatus = {
  isOpen: boolean;
  label: "Abierto ahora" | "Cerrado por el momento";
  closedMessage: string;
};

type Interval = {
  startDow: number; // 0=Sunday..6=Saturday
  startMin: number; // minutes since 00:00
  endDow: number;
  endMin: number;
};

const WEEK_MINUTES = 7 * 24 * 60;

function toAbsMinutes(dow: number, minutes: number) {
  return dow * 1440 + minutes;
}

function isInInterval(nowAbs: number, interval: Interval) {
  const startAbs = toAbsMinutes(interval.startDow, interval.startMin);
  let endAbs = toAbsMinutes(interval.endDow, interval.endMin);
  if (endAbs <= startAbs) endAbs += WEEK_MINUTES;
  return (
    (nowAbs >= startAbs && nowAbs < endAbs) ||
    (nowAbs + WEEK_MINUTES >= startAbs && nowAbs + WEEK_MINUTES < endAbs)
  );
}

const intervals: Interval[] = [
  // Viernes 19:00 -> Sabado 00:00
  { startDow: 5, startMin: 19 * 60, endDow: 6, endMin: 0 },
  // Sabados 18:30 -> Domingo 01:00 (cruza medianoche)
  { startDow: 6, startMin: 18 * 60 + 30, endDow: 0, endMin: 1 * 60 },
];

export function isStoreOpen(date = new Date()) {
  const dow = date.getDay();
  const nowMin = date.getHours() * 60 + date.getMinutes();
  const nowAbs = toAbsMinutes(dow, nowMin);
  return intervals.some((i) => isInInterval(nowAbs, i));
}

export function getStoreStatusMessage(_date = new Date()) {
  return "Ahora estamos cerrados. Tomamos pedidos viernes de 19:00 a 00:00 y sábados de 18:30 a 01:00.";
}

export function getStoreStatus(date = new Date()): StoreStatus {
  const open = isStoreOpen(date);
  return {
    isOpen: open,
    label: open ? "Abierto ahora" : "Cerrado por el momento",
    closedMessage: getStoreStatusMessage(date),
  };
}
