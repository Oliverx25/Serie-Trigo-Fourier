/**
 * Parser de expresiones matemáticas personalizadas para la Serie de Fourier
 * Usa mathjs para evaluar expresiones con la variable 't'
 */

import { create, all } from 'mathjs';
import type { SignalFunction } from './fourier';

const math = create(all);

/** Mapea t a la posición equivalente en [-T/2, T/2) para extensión periódica */
function wrapToPeriod(t: number, T: number): number {
  return t - T * Math.floor((t + T / 2) / T);
}

/**
 * Crea una función f(t) a partir de una expresión matemática.
 * La variable debe ser 't'. La función se extiende periódicamente con período T.
 * Ejemplos: "sin(2*pi*t)", "t^2", "cos(t)"
 *
 * @param expression - Expresión matemática (usa sintaxis mathjs)
 * @param T - Período para la extensión periódica
 * @returns SignalFunction o null si la expresión es inválida
 */
export function createCustomSignal(
  expression: string,
  T: number
): SignalFunction | null {
  const trimmed = expression.trim();
  if (!trimmed) return null;

  try {
    const compiled = math.compile(trimmed);
    const scope: { t: number } = { t: 0 };

    return (t: number): number => {
      const tWrapped = wrapToPeriod(t, T);
      scope.t = tWrapped;
      const result = compiled.evaluate(scope);
      return typeof result === 'number' && Number.isFinite(result) ? result : 0;
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
