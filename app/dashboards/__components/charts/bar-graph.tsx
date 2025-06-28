"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";

const chartConfig = {
  views: { label: "Page Views" },
  desktop: { label: "Desktop", color: "hsl(30, 100%, 70%)" },
  mobile: { label: "Mobile", color: "hsl(120, 100%, 70%)" },
} satisfies ChartConfig;

interface VisitorRecord {
  visitedAt: string;
  deviceType: string;
}

interface BarGraphProps {
  rawData: VisitorRecord[];
}

export function BarGraph({ rawData }: Readonly<BarGraphProps>) {
  const chartData = React.useMemo(() => {
    const map: Record<string, { desktop: number; mobile: number }> = {};

    rawData.forEach((rec) => {
      const dateKey = rec.visitedAt.split("T")[0];
      if (!map[dateKey]) {
        map[dateKey] = { desktop: 0, mobile: 0 };
      }
      if (rec.deviceType === "mobile") {
        map[dateKey].mobile += 1;
      } else {
        map[dateKey].desktop += 1;
      }
    });

    return Object.entries(map)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [rawData]);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, d) => acc + d.desktop, 0),
      mobile: chartData.reduce((acc, d) => acc + d.mobile, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row border-b p-0">
        <div className="flex-1 p-6">
          <CardTitle>Bar Chart - Pengunjung Halaman</CardTitle>
          <CardDescription className="mt-2">
            Menampilkan data pengunjung dalam {chartData.length} hari terakhir.
          </CardDescription>
        </div>
        <div className="flex">
          {(["desktop", "mobile"] as const).map((chart) => (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="relative flex-1 border-t even:border-l p-6 text-left data-[active=true]:bg-muted/50 cursor-pointer"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground mr-1">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg font-bold sm:text-3xl">
                {total[chart].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => format(parseISO(value), "MMM d")}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    format(parseISO(value), "MMM d, yyyy")
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
