/**
 * Formatea valores para etiquetas de ejes: máximo 2 decimales.
 * Números muy grandes o muy pequeños se muestran en notación exponencial.
 */
export function formatAxisTick(value: number): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1000 || (abs < 0.01 && abs > 0)) {
    const exp = value.toExponential(2);
    return exp.replace('e+', 'e').replace(/e0(?=\d)/, 'e');
  }
  const decimals = abs >= 100 ? 0 : abs >= 1 ? 2 : 2;
  const formatted = value.toFixed(decimals);
  return Number(formatted).toString();
}
