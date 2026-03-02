import { useMemo, useState } from 'react';
import {
  computeFourierCoefficients,
  evaluateFourierSeries,
} from './lib/fourier';
import { SIGNAL_OPTIONS, type SignalId } from './lib/signals';
import { FourierChart } from './components/FourierChart';
import { CoefficientsTable } from './components/CoefficientsTable';

const T = 1;
const SAMPLE_POINTS = 500;
const DEFAULT_HARMONICS = 10;

function App() {
  const [signalId, setSignalId] = useState<SignalId>('square');
  const [harmonics, setHarmonics] = useState(DEFAULT_HARMONICS);

  const signalFn = useMemo(
    () => SIGNAL_OPTIONS[signalId].fn,
    [signalId]
  );

  const { coeffs, chartData } = useMemo(() => {
    const coeffs = computeFourierCoefficients(signalFn, T, harmonics);

    const data: { t: number; original: number; fourier: number }[] = [];
    const tMin = -T * 1.5;
    const tMax = T * 1.5;
    const step = (tMax - tMin) / SAMPLE_POINTS;

    for (let t = tMin; t <= tMax; t += step) {
      data.push({
        t,
        original: signalFn(t),
        fourier: evaluateFourierSeries(coeffs, t, T),
      });
    }

    return { coeffs, chartData: data };
  }, [signalFn, harmonics]);

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
                </select>
              </div>
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
            <FourierChart data={chartData} />
          </section>

          {/* Coeficientes */}
          <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6">
            <h2 className="mb-4 font-display text-lg font-medium text-zinc-200">
              Coeficientes de Fourier
            </h2>
            <CoefficientsTable coeffs={coeffs} />
          </section>
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-800/60 py-6 text-center text-sm text-zinc-500">
        Serie Trigonométrica de Fourier en Tiempo Continuo · T = {T}
      </footer>
    </div>
  );
}

export default App;
