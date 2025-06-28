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
import { DistrictFacilities } from "./tooltip";

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

export function PieGraph({ data, hoverInfo }: { data: DistrictFacilities, hoverInfo: Record<string, any> }) {
  const chartData: ChartEntry[] = React.useMemo(() => {
    return Object.entries(data.facilityCounts)
      .filter(([key]) => key !== "totalCount")
      .map(([key, value]) => ({
        browser: chartConfig[key]?.label ?? key,
        visitors: value,
        fill: chartConfig[key]?.color ?? "gray",
      }));
  }, [data]);

  const districtName = hoverInfo['districtName'] || "Unknown" as string;
  const disabilityScore = hoverInfo['disabilityScore'] - 1;

  return (
    <Card className="hidden md:flex md:flex-col">
      <CardHeader className="flex justify-between items-center pb-0">
        <div className="flex flex-col gap-2 text-xl">
          <CardTitle>{hoverInfo['districtName']}</CardTitle>
          <CardDescription className="font-semibold">{`Nilai Aksesibilitas: ${disabilityScore}`}</CardDescription>
          <CardDescription>{`Menampilkan keseluruhan fasilitias di kecamatan ${districtName}`}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length == 0 &&
          <CardDescription className="text-center font-extrabold text-2xl mt-10">No Data</CardDescription>
        }
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
                          {data.facilityCounts?.totalCount || 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Fasum
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
