"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";

type ChartEntry = {
  browser: string;
  visitors: number;
  fill: string;
};

const chartConfig: any = {
  wheelchair: { label: "Kursi Roda", color: "hsl(20, 100%, 65%)" },
  toilet: { label: "Toilet Difabel", color: "hsl(140, 70%, 60%)" },
  ramp: { label: "Jalan Difabel", color: "hsl(220, 90%, 65%)" },
  lift: { label: "Lift Difabel", color: "hsl(300, 80%, 70%)" },
  escalator: { label: "Eskalator", color: "hsl(45, 100%, 60%)" },
  parking: { label: "Parkir Difabel", color: "hsl(90, 80%, 65%)" },
};

export function PieGraph({ data }: { data: Record<string, number> }) {
  const chartData: ChartEntry[] = React.useMemo(() => {
    return Object.entries(data)
      .filter(([key]) => key !== "total")
      .map(([key, value]) => ({
        browser: chartConfig[key]?.label ?? key,
        visitors: value,
        fill: chartConfig[key]?.color ?? "gray",
      }));
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex justify-between items-center pb-0">
        <div className="flex flex-col gap-2">
          <CardTitle>Pie Chart - Tag Fasum</CardTitle>
          <CardDescription>Menampilkan keseluruhan data tag</CardDescription>
        </div>
        <Link
          href={"/dashboards/tags"}
          className="text-xs bg-gray-100 p-3 rounded font-medium hover:text-blue-500 transition"
        >
          Lihat lainnya
        </Link>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data.total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tag Fasum
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
