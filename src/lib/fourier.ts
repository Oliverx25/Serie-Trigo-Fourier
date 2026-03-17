/**
 * Cálculo de la Serie Trigonométrica de Fourier en Tiempo Continuo
 *
 * f(t) = a₀/2 + Σ[aₙ·cos(2πn t/T) + bₙ·sin(2πn t/T)]  para n = 1 .. N
 *
 * Coeficientes (integrando sobre UN PERÍODO en intervalo CERRADO):
 * a₀ = (2/T) ∫_{[-T/2, T/2]} f(t) dt
 * aₙ = (2/T) ∫_{[-T/2, T/2]} f(t)·cos(2πn t/T) dt
 * bₙ = (2/T) ∫_{[-T/2, T/2]} f(t)·sin(2πn t/T) dt
 *
 * IMPORTANTE: Toda la integración se realiza en el INTERVALO CERRADO [-T/2, T/2].
 */

export type SignalFunction = (t: number) => number;

/**
 * Integración numérica por regla de Simpson (1/3) en intervalo CERRADO [a, b].
 * Evalúa f en a, a+h, ..., b (incluye ambos extremos). n = número de subintervalos.
 */
function simpsonIntegral(
  f: SignalFunction,
  a: number,
  b: number,
  n: number = 1000
): number {
  const h = (b - a) / n;
  let sum = f(a) + f(b);

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += i % 2 === 0 ? 2 * f(x) : 4 * f(x);
  }

  return (h / 3) * sum;
}

/**
 * Calcula el coeficiente a₀ (componente DC).
 * Integración en INTERVALO CERRADO [-T/2, T/2].
 */
export function computeA0(f: SignalFunction, T: number): number {
  const factor = 2 / T;
  return factor * simpsonIntegral(f, -T / 2, T / 2);
}

/**
 * Calcula el coeficiente aₙ.
 * Integración en INTERVALO CERRADO [-T/2, T/2].
 */
export function computeAn(
  f: SignalFunction,
  T: number,
  n: number
): number {
  const factor = 2 / T;
  const integrand = (t: number) =>
    f(t) * Math.cos((2 * n * Math.PI * t) / T);
  return factor * simpsonIntegral(integrand, -T / 2, T / 2);
}

/**
 * Calcula el coeficiente bₙ.
 * Integración en INTERVALO CERRADO [-T/2, T/2].
 */
export function computeBn(
  f: SignalFunction,
  T: number,
  n: number
): number {
  const factor = 2 / T;
  const integrand = (t: number) =>
    f(t) * Math.sin((2 * n * Math.PI * t) / T);
  return factor * simpsonIntegral(integrand, -T / 2, T / 2);
}

export interface FourierCoefficients {
  a0: number;
  an: number[];
  bn: number[];
}

/**
 * Calcula todos los coeficientes de Fourier hasta el armónico N (n = 1 .. N).
 * Todas las integrales se evalúan en el INTERVALO CERRADO [-T/2, T/2].
 */
export function computeFourierCoefficients(
  f: SignalFunction,
  T: number,
  N: number
): FourierCoefficients {
  const a0 = computeA0(f, T);
  const an: number[] = [];
  const bn: number[] = [];

  for (let n = 1; n <= N; n++) {
    an.push(computeAn(f, T, n));
    bn.push(computeBn(f, T, n));
  }

  return { a0, an, bn };
}

/**
 * Evalúa la aproximación de Fourier en el punto t (ωₙ = 2πn/T).
 * Los coeficientes fueron calculados integrando en el INTERVALO CERRADO [-T/2, T/2].
 */
export function evaluateFourierSeries(
  coeffs: FourierCoefficients,
  t: number,
  T: number
): number {
  let result = coeffs.a0 / 2;

  for (let n = 1; n <= coeffs.an.length; n++) {
    const omega = (2 * n * Math.PI) / T;
    result += coeffs.an[n - 1] * Math.cos(omega * t);
    result += coeffs.bn[n - 1] * Math.sin(omega * t);
  }

  return result;
}
