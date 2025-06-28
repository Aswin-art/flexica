"use client";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import DataTable from "../__components/locations-table/data-table";
import { columns } from "../__components/locations-table/columns";
import LoadingState from "@/components/loading-state";
import { useLocationsDashboard } from "@/queries/placeQuery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Page = () => {
  const { data, isLoading } = useLocationsDashboard("all");

  return (
    <ScrollArea className="h-full mt-15 md:mt-0">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboards">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Lokasi Fasum</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Lokasi Fasum</h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Kelola data lokasi fasum difabel dengan mudah dan efisien.
            </p>
          </div>
          <Link
            href={"/dashboards/locations/create"}
            className={cn(
              buttonVariants(),
              "text-xs md:text-sm bg-blue-500 hover:bg-blue-600"
            )}
          >
            <Plus className="mr-2 size-4" /> Tambah Data
          </Link>
        </div>
        <Separator />

        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <LoadingState color="blue" />
          </div>
        ) : (
          <DataTable data={data.data.places} columns={columns} />
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
