/**
 * Convierte una fecha ISO (yyyy-mm-dd) a formato dd/mm/yyyy
 */
export function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Convierte una fecha ISO a formato yyyy-mm-dd para input type="date"
 */
export function formatDateInput(isoDate: string): string {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
}
