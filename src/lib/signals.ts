/**
 * Señales periódicas predefinidas para la Serie de Fourier
 * f(t) definida para t ∈ [-T/2, T/2], extendida periódicamente
 */

import type { SignalFunction } from './fourier';

/** Normaliza t al intervalo [0, 1) dentro del período T */
function normalizePhase(t: number, T: number): number {
  return ((t / T + 0.5) % 1 + 1) % 1;
}

/** Onda cuadrada: discontinuidad desplazada para que ningún armónico pase por el salto.
 *  Con 5 armónicos: 6 semiciclos en un lado y 4 en el otro (el armónico no cruza la indeterminación).
 *  Discontinuidad en phase = 0.4 (p. ej. t = -T/10 para T=1) en lugar de 0.5. */
export const squareWave: SignalFunction = (t) => {
  const T = 1;
  const phase = normalizePhase(t, T);
  return phase < 0.4 ? -1 : 1;
};

/** Diente de sierra: rampa de -1 a 1 en un período */
export const sawtoothWave: SignalFunction = (t) => {
  const T = 1;
  const phase = normalizePhase(t, T);
  return 2 * phase - 1;
};

/** Onda triangular */
export const triangleWave: SignalFunction = (t) => {
  const T = 1;
  const phase = normalizePhase(t, T);
  return 4 * Math.abs(phase - 0.5) - 1;
};

/** Onda sinusoidal */
export const sineWave: SignalFunction = (t) => {
  const T = 1;
  return Math.sin((2 * Math.PI * t) / T);
};

/** Pulso rectangular con duty cycle d (0-1) */
export const createRectangularPulse = (dutyCycle: number): SignalFunction => {
  const d = Math.max(0.01, Math.min(0.99, dutyCycle));
  return (t) => {
    const T = 1;
    const phase = normalizePhase(t, T);
    return phase < d ? 1 : 0;
  };
};

export type SignalId =
  | 'square'
  | 'sawtooth'
  | 'triangle'
  | 'sine'
  | 'rect'
  | 'custom';

export const SIGNAL_OPTIONS: Record<
  Exclude<SignalId, 'custom'>,
  { label: string; fn: SignalFunction }
> = {
  square: { label: 'Onda cuadrada', fn: squareWave },
  sawtooth: { label: 'Diente de sierra', fn: sawtoothWave },
  triangle: { label: 'Onda triangular', fn: triangleWave },
  sine: { label: 'Sinusoidal', fn: sineWave },
  rect: {
    label: 'Pulso rectangular',
    fn: createRectangularPulse(0.25),
  },
};

export const CUSTOM_LABEL = 'Expresión personalizada';
