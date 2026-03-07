import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatAxisTick } from '../lib/formatAxisTick';

interface ChartPoint {
  t: number;
  original: number;
  fourier: number;
}

interface FourierChartProps {
  data: ChartPoint[];
  /** Dominio Y fijo o 'auto' para adaptar al rango de los datos */
  yDomain?: [number, number] | 'auto';
  /** Dominio X fijo para centrar t=0 (ej. [tMin, tMax]) */
  xDomain?: [number, number];
}

export function FourierChart({
  data,
  yDomain = [-1.5, 1.5],
  xDomain,
}: FourierChartProps) {
  const domain: [number, number] =
    yDomain === 'auto'
      ? (() => {
          const values = data.flatMap((d) => [d.original, d.fourier]);
          if (values.length === 0) return [-1.5, 1.5];
          const min = Math.min(...values);
          const max = Math.max(...values);
          const padding = Math.max(0.2, (max - min) * 0.1);
          return [min - padding, max + padding];
        })()
      : yDomain;
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 24, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} />
          <XAxis
            dataKey="t"
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickFormatter={(v) => formatAxisTick(Number(v))}
            domain={xDomain}
            label={{
              value: 't',
              position: 'insideBottom',
              offset: -5,
              fill: '#71717a',
            }}
          />
          <YAxis
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickFormatter={(v) => formatAxisTick(Number(v))}
            domain={domain}
            label={{
              value: 'Amplitud',
              angle: -90,
              position: 'insideLeft',
              fill: '#71717a',
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#27272a',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#a1a1aa' }}
            formatter={(value: number, name: string) => [
              formatAxisTick(value),
              name,
            ]}
            labelFormatter={(t) => `t = ${Number(t).toFixed(3)}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value) => (
              <span className="text-sm text-zinc-300">{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="original"
            name="Señal original"
            stroke="#00d4aa"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="fourier"
            name="Aproximación Fourier"
            stroke="#f472b6"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            connectNulls
          />
          {/* Eje horizontal F(t)=0 (eje de las x) — punteado */}
          <ReferenceLine y={0} stroke="#52525b" strokeWidth={1.5} strokeDasharray="2 2" />
          {/* Eje vertical t=0 (eje de las ordenadas) — punteado, dibujado encima para que se vea */}
          <ReferenceLine
            x={0}
            stroke="#a1a1aa"
            strokeWidth={2}
            strokeDasharray="4 4"
            label={{
              value: 't = 0',
              position: 'insideTop',
              fill: '#e4e4e7',
              fontSize: 12,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
