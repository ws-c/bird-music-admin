"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type MonthlyTrend = {
  month: string;
  count: number;
};
interface TooltipPayload {
  payload: {
    month: string;
    count: number;
  };
  value: number;
}
interface CustomTooltipProps {
  active: boolean;
  payload: TooltipPayload[] | null;
}
// 自定义Tooltip组件
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as MonthlyTrend;
    return (
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <p className="font-medium">{data.month}</p>
        <p className="text-sm">播放量: {data.count.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function PlayCount({ data }: { data: MonthlyTrend[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false} // 禁止小数
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltip active={false} payload={null} />}
          cursor={{
            stroke: "#f0f0f0",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#4e8074"
          strokeWidth={2}
          dot={{
            fill: "#4e8074",
            strokeWidth: 2,
            r: 3,
          }}
          activeDot={{
            r: 6,
            fill: "#4e8074",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
