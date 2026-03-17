/**
 * Parser de expresiones matemáticas personalizadas para la Serie de Fourier.
 * Variable: t (tiempo real). Se evalúa f(t) en cada t para que la gráfica
 * muestre la función correcta (ej: "sin(t)" como seno). Los coeficientes
 * se calculan integrando f(t) en el INTERVALO CERRADO [-T/2, T/2] (véase fourier.ts).
 */

import { create, all } from 'mathjs';
import type { SignalFunction } from './fourier';

const math = create(all);

/**
 * Crea una función f(t) a partir de una expresión matemática.
 * La variable debe ser 't'. Se evalúa en el tiempo real t (sin extensión periódica
 * en la gráfica), para que expresiones como "sin(t)" se vean correctamente.
 *
 * @param expression - Expresión matemática (usa sintaxis mathjs)
 * @param _T - Período usado para el cálculo de coeficientes (integración en [-T/2, T/2])
 * @returns SignalFunction o null si la expresión es inválida
 */
export function createCustomSignal(
  expression: string,
  _T: number
): SignalFunction | null {
  const trimmed = expression.trim();
  if (!trimmed) return null;

  try {
    const compiled = math.compile(trimmed);
    const scope: { t: number } = { t: 0 };

    return (t: number): number => {
      scope.t = t;
      try {
        const result = compiled.evaluate(scope);
        return typeof result === 'number' && Number.isFinite(result) ? result : 0;
      } catch {
        return 0;
      }
    };
  } catch {
    return null;
  }
}

/**
 * Valida si una expresión es correcta (sin evaluarla)
 */
export function validateExpression(expression: string): boolean {
  const trimmed = expression.trim();
  if (!trimmed) return false;

  try {
    math.compile(trimmed);
    return true;
  } catch {
    return false;
  }
}
