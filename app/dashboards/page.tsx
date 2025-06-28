"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarGraph } from "./__components/charts/bar-graph";
import { AreaGraph } from "./__components/charts/area-graph";
import { PieGraph } from "./__components/charts/pie-graph";
import {
  useCardDashboardData,
  useSubmissionCardData,
  useVisitorChartData,
} from "@/queries/dashboardQuery";
import LoadingState from "@/components/loading-state";
import { BookCopy, Building, Store, Tag } from "lucide-react";
import { RecentSales } from "./__components/charts/recent-sales";
import Link from "next/link";

export default function Page() {
  const { data, isLoading } = useCardDashboardData();
  const { data: submissions } = useSubmissionCardData();
  const { data: visitorCharts } = useVisitorChartData();

  return (
    <ScrollArea className="h-full mt-15 md:mt-0">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back <span className="text-blue-500">Admin</span> 👋
          </h2>
        </div>
        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <LoadingState color="blue" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Lokasi
                    </CardTitle>
                    <Building className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.data.allCountData.locationCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +100% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Submission
                    </CardTitle>
                    <BookCopy className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      +{data.data.allCountData.submissionCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +100% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Fasilitas Umum
                    </CardTitle>
                    <Store className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.data.allCountData.facilityCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +100% since last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Tag Lokasi
                    </CardTitle>
                    <Tag className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data.data.allCountData.tagCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +100% since last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                  <BarGraph rawData={visitorCharts?.data ?? []} />
                </div>
                <Card className="col-span-4 md:col-span-3">
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <CardTitle>Submisi terakhir</CardTitle>
                      <CardDescription>
                        Ada sebanyak {data.data.allCountData.submissionCount}{" "}
                        ajuan yang berhasil tersubmit.
                      </CardDescription>
                    </div>
                    <Link
                      href={"/dashboards/submissions"}
                      className="text-xs bg-gray-100 p-3 rounded font-medium hover:text-blue-500 transition"
                    >
                      Lihat lainnya
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <RecentSales items={submissions?.data ?? []} />
                  </CardContent>
                </Card>
                <div className="col-span-4">
                  <AreaGraph rawData={visitorCharts?.data ?? []} />
                </div>
                <div className="col-span-4 md:col-span-3">
                  <PieGraph data={data?.data?.fasumSummary ?? []} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ScrollArea>
  );
}
