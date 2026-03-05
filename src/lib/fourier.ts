/**
 * Cálculo de la Serie Trigonométrica de Fourier en Tiempo Continuo
 *
 * Convención: "N armónicos" = N ciclos visibles del armónico más alto por periodo.
 * Se usan 2N términos con frecuencia angular ωₙ = πn/T (periodo 2T para el fundamental).
 *
 * f(t) = a₀/2 + Σ[aₙ·cos(πn t/T) + bₙ·sin(πn t/T)]  para n = 1 .. 2N
 *
 * Coeficientes:
 * a₀ = (2/T) ∫ f(t) dt
 * aₙ = (2/T) ∫ f(t)·cos(πn t/T) dt
 * bₙ = (2/T) ∫ f(t)·sin(πn t/T) dt
 */

export type SignalFunction = (t: number) => number;

/** Integración numérica por regla de Simpson (1/3) */
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
 * Calcula el coeficiente a₀ (componente DC)
 */
export function computeA0(f: SignalFunction, T: number): number {
  const factor = 2 / T;
  return factor * simpsonIntegral(f, -T / 2, T / 2);
}

/**
 * Calcula el coeficiente aₙ (usa frecuencia πn/T para que N armónicos = N ciclos visibles)
 */
export function computeAn(
  f: SignalFunction,
  T: number,
  n: number
): number {
  const factor = 2 / T;
  const integrand = (t: number) =>
    f(t) * Math.cos((n * Math.PI * t) / T);
  return factor * simpsonIntegral(integrand, -T / 2, T / 2);
}

/**
 * Calcula el coeficiente bₙ (usa frecuencia πn/T)
 */
export function computeBn(
  f: SignalFunction,
  T: number,
  n: number
): number {
  const factor = 2 / T;
  const integrand = (t: number) =>
    f(t) * Math.sin((n * Math.PI * t) / T);
  return factor * simpsonIntegral(integrand, -T / 2, T / 2);
}

export interface FourierCoefficients {
  a0: number;
  an: number[];
  bn: number[];
}

/**
 * Calcula todos los coeficientes de Fourier.
 * "N armónicos" = N ciclos visibles por periodo → se calculan 2N términos (n=1..2N)
 * con ωₙ = πn/T para que el término 2N tenga exactamente N ciclos por periodo T.
 */
export function computeFourierCoefficients(
  f: SignalFunction,
  T: number,
  N: number
): FourierCoefficients {
  const a0 = computeA0(f, T);
  const an: number[] = [];
  const bn: number[] = [];
  const numTerms = Math.max(1, 2 * N);

  for (let n = 1; n <= numTerms; n++) {
    an.push(computeAn(f, T, n));
    bn.push(computeBn(f, T, n));
  }

  return { a0, an, bn };
}

/**
 * Evalúa la aproximación de Fourier en el punto t (ωₙ = πn/T).
 */
export function evaluateFourierSeries(
  coeffs: FourierCoefficients,
  t: number,
  T: number
): number {
  let result = coeffs.a0 / 2;

  for (let n = 1; n <= coeffs.an.length; n++) {
    const omega = (n * Math.PI) / T;
    result += coeffs.an[n - 1] * Math.cos(omega * t);
    result += coeffs.bn[n - 1] * Math.sin(omega * t);
  }

  return result;
}
