"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// 模拟播放量数据（实际应从数据库获取）
const mockPlayData = [
  { month: "Jan", plays: 2345 },
  { month: "Feb", plays: 3456 },
  { month: "Mar", plays: 4123 },
  { month: "Apr", plays: 5678 },
  { month: "May", plays: 4890 },
  { month: "Jun", plays: 6321 },
  { month: "Jul", plays: 7210 },
  { month: "Aug", plays: 6543 },
  { month: "Sep", plays: 5890 },
  { month: "Oct", plays: 8321 },
  { month: "Nov", plays: 7456 },
  { month: "Dec", plays: 9210 },
];

// 自定义Tooltip样式
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <p className="font-medium">{payload[0].payload.month}</p>
        <p className="text-sm ">播放量: {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function PlayCount() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={mockPlayData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toLocaleString()}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="plays"
          stroke="#4e8074"
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
