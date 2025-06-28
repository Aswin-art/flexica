"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React from "react";
import DataTable from "../__components/feedbacks-table/data-table";
import { columns } from "../__components/feedbacks-table/columns";
import LoadingState from "@/components/loading-state";
import { useFeedbacks } from "@/queries/feedbackQuery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Page = () => {
  const { data, isLoading } = useFeedbacks();

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
              <BreadcrumbPage>Ulasan Pengguna</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Ulasan Pengguna
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Kelola data ulasan pengguna fasum dengan mudah dan efisien.
            </p>
          </div>
        </div>
        <Separator />

        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <LoadingState color="blue" />
          </div>
        ) : (
          <DataTable data={data.data} columns={columns} />
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
