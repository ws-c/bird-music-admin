"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewProps = {
  data?: Array<{
    month: string;
    count: number;
  }>;
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

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <p className="font-medium">{payload[0]?.payload.month}</p>
        <p className="text-sm">
          新增用户: {payload[0]?.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};
export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          fontSize={12}
          stroke="#888888"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false} // 禁止小数
          fontSize={12}
          stroke="#888888"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip active={false} payload={null} />} />
        <Bar
          dataKey="count"
          fill="#adfa1d"
          radius={[4, 4, 0, 0]}
          name="新增用户"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
