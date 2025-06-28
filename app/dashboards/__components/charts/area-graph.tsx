"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VisitorRecord {
  visitedAt: string;
  deviceType: string;
}

interface AreaGraphProps {
  rawData: VisitorRecord[];
}

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(30, 100%, 70%)" },
  mobile: { label: "Mobile", color: "hsl(120, 100%, 70%)" },
} satisfies ChartConfig;

export function AreaGraph({ rawData }: Readonly<AreaGraphProps>) {
  const chartData = React.useMemo(() => {
    const map: Record<string, { desktop: number; mobile: number }> = {};

    rawData.forEach((rec) => {
      const date = new Date(rec.visitedAt);
      const monthName = date.toLocaleString("default", { month: "long" });
      if (!map[monthName]) {
        map[monthName] = { desktop: 0, mobile: 0 };
      }
      if (rec.deviceType === "mobile") {
        map[monthName].mobile += 1;
      } else {
        map[monthName].desktop += 1;
      }
    });

    const monthsOrder = Object.entries(map)
      .map(([month, counts]) => {
        const date = new Date(`${month} 1, 2000`);
        return { month, ...counts, order: date.getMonth() };
      })
      .sort((a, b) => a.order - b.order)
      .map(({ month, desktop, mobile }) => ({ month, desktop, mobile }));

    return monthsOrder;
  }, [rawData]);

  const totalDelta = React.useMemo(() => {
    if (chartData.length < 2) return 0;
    const last = chartData[chartData.length - 1];
    const prev = chartData[chartData.length - 2];
    const sumLast = last.desktop + last.mobile;
    const sumPrev = prev.desktop + prev.mobile;
    return ((sumLast - sumPrev) / (sumPrev || 1)) * 100;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Pengunjung Halaman</CardTitle>
        <CardDescription>
          Menampilkan data pengunjung dalam {chartData.length} bulan terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending meningkat {totalDelta.toFixed(1)}% dalam bulan ini{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData.length > 1
                ? `${chartData[0].month} - ${
                    chartData[chartData.length - 1].month
                  }`
                : chartData[0]?.month}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
