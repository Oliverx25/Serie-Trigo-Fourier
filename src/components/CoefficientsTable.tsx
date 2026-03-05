import type { FourierCoefficients } from '../lib/fourier';

interface CoefficientsTableProps {
  coeffs: FourierCoefficients;
}

export function CoefficientsTable({ coeffs }: CoefficientsTableProps) {
  const rows = coeffs.an.map((an, i) => ({
    n: i + 1,
    an: coeffs.an[i],
    bn: coeffs.bn[i],
  }));

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 rounded-lg bg-zinc-800/50 px-4 py-3 font-mono text-sm">
        <span className="text-zinc-400">a₀ = </span>
        <span className="text-emerald-400">{coeffs.a0.toFixed(6)}</span>
      </div>
      <table className="w-full min-w-[320px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="px-4 py-3 text-left font-display font-medium text-zinc-400">
              n
            </th>
            <th className="px-4 py-3 text-left font-display font-medium text-zinc-400">
              aₙ
            </th>
            <th className="px-4 py-3 text-left font-display font-medium text-zinc-400">
              bₙ
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ n, an, bn }) => (
            <tr
              key={n}
              className="border-b border-zinc-800/80 hover:bg-zinc-800/30"
            >
              <td className="px-4 py-2.5 font-display text-zinc-300">{n}</td>
              <td className="px-4 py-2.5 font-mono text-emerald-400/90">
                {an.toFixed(6)}
              </td>
              <td className="px-4 py-2.5 font-mono text-pink-400/90">
                {bn.toFixed(6)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-zinc-500">
        f(t) = a₀/2 + Σ[aₙ·cos(2πnt/T) + bₙ·sin(2πnt/T)]
      </p>
    </div>
  );
}
