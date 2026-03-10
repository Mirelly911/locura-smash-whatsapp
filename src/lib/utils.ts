import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGs(value: number) {
  const rounded = Math.round(value || 0)
  const formatted = new Intl.NumberFormat("es-PY", {
    maximumFractionDigits: 0,
  }).format(rounded)
  return `Gs. ${formatted}`
}
