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
const RANGE_MIN = 0.5;
const RANGE_MAX = 50;
const RANGE_DEFAULT = 1.5;
/** Para expresión personalizada: período = ancho del rango mostrado */
const SAMPLE_POINTS = 500;
const DEFAULT_HARMONICS = 10;
const DEFAULT_CUSTOM_EXPRESSION = 'sin(2*pi*t)';

function App() {
  const [signalId, setSignalId] = useState<SignalId>('square');
  const [harmonics, setHarmonics] = useState(DEFAULT_HARMONICS);
  const [customExpression, setCustomExpression] =
    useState(DEFAULT_CUSTOM_EXPRESSION);
  const [range, setRange] = useState(RANGE_DEFAULT);

  const tMin = -range;
  const tMax = range;
  const T_CUSTOM = tMax - tMin;

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
    const step = (tMax - tMin) / SAMPLE_POINTS;

    for (let t = tMin; t <= tMax; t += step) {
      data.push({
        t,
        original: signalFn(t),
        fourier: evaluateFourierSeries(coeffs, t, period),
      });
    }

    return { coeffs, chartData: data, isValid: true, error: null };
  }, [signalFn, harmonics, signalId, tMin, tMax]);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-emerald-400 sm:text-3xl">
            Serie Trigonométrica de Fourier
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Tiempo continuo — Descomposición en armónicos
          </p>
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
            <div className="mt-6 flex flex-wrap items-end gap-4 border-t border-zinc-700/50 pt-6">
              <div>
                <label
                  htmlFor="range"
                  className="mb-2 block text-sm font-medium text-zinc-400"
                >
                  Rango de la gráfica (eje t)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="range"
                    type="number"
                    min={RANGE_MIN}
                    max={RANGE_MAX}
                    step={0.5}
                    value={range}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!Number.isNaN(v))
                        setRange(Math.max(RANGE_MIN, Math.min(RANGE_MAX, v)));
                    }}
                    className="w-24 rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 font-display text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-zinc-500">
                    t ∈ [−{range}, {range}]
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {[2, 5, 10, 20].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      range === r
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600/80'
                    }`}
                  >
                    ±{r}
                  </button>
                ))}
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
                xDomain={[tMin, tMax]}
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
