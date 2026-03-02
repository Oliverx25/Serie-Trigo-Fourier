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

interface ChartPoint {
  t: number;
  original: number;
  fourier: number;
}

interface FourierChartProps {
  data: ChartPoint[];
}

export function FourierChart({ data }: FourierChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} />
          <XAxis
            dataKey="t"
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickFormatter={(v) => v.toFixed(2)}
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
            domain={[-1.5, 1.5]}
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
              value.toFixed(4),
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
          <ReferenceLine x={0} stroke="#52525b" strokeDasharray="2 2" />
          <ReferenceLine y={0} stroke="#52525b" strokeDasharray="2 2" />
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
