"use client";

import React, { useEffect, useState } from "react";
import Mapbox from "@/components/mapbox/map";
import { useSearchParams } from "next/navigation";
import { useLocations, usePotentials } from "@/queries/placeQuery";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterForm from "./__components/filter-form";
import Places from "./__components/places";

export type TabValue = "location" | "submission";

const MapClient = () => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const name = searchParams.get("name") ?? "";
  const facilities = searchParams.get("facilities") ?? "";
  const sort_asc = searchParams.get("sort_asc") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const query = { name, facilities, sort_asc, tag };

  const [activeTab, setActiveTab] = useState<TabValue>("location");

  const {
    data: locData,
    isLoading: locLoading,
    refetch: refetchLoc,
  } = useLocations("all", query, page);

  const {
    data: potData,
    isLoading: potLoading,
    refetch: refetchPot,
  } = usePotentials("potential", query, page);

  useEffect(() => {
    if (activeTab === "location") {
      refetchLoc();
    } else {
      refetchPot();
    }
  }, [searchParams, activeTab, refetchLoc, refetchPot]);

  const data = activeTab === "location" ? locData : potData;
  const isLoading = activeTab === "location" ? locLoading : potLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 h-screen w-full overflow-hidden p-4 gap-4">
        <div className="col-span-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 h-screen w-full overflow-hidden p-4 gap-4 mt-15 md:mt-0">
      <div className="hidden lg:block col-span-4">
        <FilterForm />
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
          className="w-full mt-3"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="location" className="cursor-pointer">
              Lokasi Fasum
            </TabsTrigger>
            <TabsTrigger value="submission" className="cursor-pointer">
              Ajuan Fasum
            </TabsTrigger>
          </TabsList>
          <TabsContent value="location">
            <Places
              items={data?.data?.places ?? []}
              itemsPerPage={10}
              totalItems={data?.data?.totalItems ?? 0}
              loading={isLoading}
              isSubmission={false}
            />
          </TabsContent>
          <TabsContent value="submission">
            <Places
              items={data?.data?.places ?? []}
              itemsPerPage={10}
              totalItems={data?.data?.totalItems ?? 0}
              loading={isLoading}
              isSubmission={true}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <Mapbox
          items={data?.data?.places ?? []}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};

export default MapClient;
