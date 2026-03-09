import { useMemo, useState } from 'react';
import {
  computeFourierCoefficients,
  evaluateFourierSeries,
} from './lib/fourier';
import { createCustomSignal } from './lib/customExpression';
import {
  SIGNAL_OPTIONS,
  CUSTOM_LABEL,
  type SignalId,
} from './lib/signals';
import { FourierChart } from './components/FourierChart';
import { CoefficientsTable } from './components/CoefficientsTable';

const T = 1;
const T_MIN = -T * 1.5;
const T_MAX = T * 1.5;
/** Para expresión personalizada: período = ancho del rango mostrado, así la serie aproxima toda la curva visible */
const T_CUSTOM = T_MAX - T_MIN;
const SAMPLE_POINTS = 500;
const DEFAULT_HARMONICS = 10;
const DEFAULT_CUSTOM_EXPRESSION = 'sin(2*pi*t)';

function App() {
  const [signalId, setSignalId] = useState<SignalId>('square');
  const [harmonics, setHarmonics] = useState(DEFAULT_HARMONICS);
  const [customExpression, setCustomExpression] =
    useState(DEFAULT_CUSTOM_EXPRESSION);

  const signalFn = useMemo(() => {
    if (signalId === 'custom') {
      return createCustomSignal(customExpression, T);
    }
    return SIGNAL_OPTIONS[signalId].fn;
  }, [signalId, customExpression]);

  const { coeffs, chartData, isValid, error } = useMemo(() => {
    if (!signalFn) {
      return {
        coeffs: { a0: 0, an: [], bn: [] },
        chartData: [] as { t: number; original: number; fourier: number }[],
        isValid: false,
        error: 'Expresión inválida. Usa la variable t (ej: sin(2*pi*t))',
      };
    }

    const period = signalId === 'custom' ? T_CUSTOM : T;
    const coeffs = computeFourierCoefficients(signalFn, period, harmonics);

    const data: { t: number; original: number; fourier: number }[] = [];
    const step = (T_MAX - T_MIN) / SAMPLE_POINTS;

    for (let t = T_MIN; t <= T_MAX; t += step) {
      data.push({
        t,
        original: signalFn(t),
        fourier: evaluateFourierSeries(coeffs, t, period),
      });
    }

    return { coeffs, chartData: data, isValid: true, error: null };
  }, [signalFn, harmonics, signalId]);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-emerald-400 sm:text-3xl">
              Serie Trigonométrica de Fourier
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Tiempo continuo — Descomposición en armónicos
            </p>
          </div>
          <a
            href="https://github.com/Oliverx25/Serie-Trigo-Fourier"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800/80 hover:text-white"
            aria-label="Ver repositorio en GitHub"
          >
            <svg className="h-7 w-7 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Controles */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6">
            <h2 className="mb-4 font-display text-lg font-medium text-zinc-200">
              Parámetros
            </h2>
            <div className="flex flex-wrap gap-6">
              <div>
                <label
                  htmlFor="signal"
                  className="mb-2 block text-sm font-medium text-zinc-400"
                >
                  Señal
                </label>
                <select
                  id="signal"
                  value={signalId}
                  onChange={(e) => setSignalId(e.target.value as SignalId)}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 font-display text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {(Object.entries(SIGNAL_OPTIONS) as [SignalId, { label: string }][]).map(
                    ([id, { label }]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    )
                  )}
                  <option value="custom">{CUSTOM_LABEL}</option>
                </select>
              </div>
              {signalId === 'custom' && (
                <div className="min-w-[240px] flex-1">
                  <label
                    htmlFor="customExpr"
                    className="mb-2 block text-sm font-medium text-zinc-400"
                  >
                    Expresión f(t)
                  </label>
                  <input
                    id="customExpr"
                    type="text"
                    value={customExpression}
                    onChange={(e) => setCustomExpression(e.target.value)}
                    placeholder="sin(2*pi*t)"
                    className={`w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-1 ${
                      isValid
                        ? 'border-zinc-700 bg-zinc-800/80 text-zinc-100 focus:border-emerald-500 focus:ring-emerald-500'
                        : 'border-red-500/60 bg-zinc-800/80 text-zinc-100 focus:border-red-500 focus:ring-red-500'
                    }`}
                  />
                  {!isValid && error && (
                    <p className="mt-1.5 text-xs text-red-400">{error}</p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500">
                    Variable: t · Ej: sin(2*pi*t), t^2, cos(t)
                  </p>
                </div>
              )}
              <div>
                <label
                  htmlFor="harmonics"
                  className="mb-2 block text-sm font-medium text-zinc-400"
                >
                  Número de armónicos
                </label>
                <input
                  id="harmonics"
                  type="number"
                  min={1}
                  max={50}
                  value={harmonics}
                  onChange={(e) =>
                    setHarmonics(Math.max(1, Math.min(50, +e.target.value || 1)))
                  }
                  className="w-24 rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 font-display text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Gráfica */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6">
            <h2 className="mb-4 font-display text-lg font-medium text-zinc-200">
              Gráfica
            </h2>
            {chartData.length > 0 ? (
              <FourierChart
                data={chartData}
                yDomain={signalId === 'custom' ? 'auto' : undefined}
                xDomain={[T_MIN, T_MAX]}
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-lg bg-zinc-800/30 text-zinc-500">
                Ingresa una expresión válida para ver la gráfica
              </div>
            )}
          </section>

          {/* Coeficientes */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6">
            <h2 className="mb-4 font-display text-lg font-medium text-zinc-200">
              Coeficientes de Fourier
            </h2>
            {isValid ? (
              <CoefficientsTable coeffs={coeffs} />
            ) : (
              <p className="text-sm text-zinc-500">
                Los coeficientes se mostrarán cuando la expresión sea válida.
              </p>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-800/60 py-6 text-center text-sm text-zinc-500">
        Serie Trigonométrica de Fourier en Tiempo Continuo
        {signalId === 'custom' ? ` · Período de análisis T = ${T_CUSTOM}` : ` · T = ${T}`}
      </footer>
    </div>
  );
}

export default App;
