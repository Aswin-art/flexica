import { PieGraph } from "@/components/mapbox/pie-graph";
import { useEffect, useState, useMemo } from "react";

export interface DistrictFacilities {
  districtName: string;
  facilityCounts: Record<string, number>
}

export default function Tooltip(
  hoverInfo: Readonly<{
    districtName: string;
    y: number;
    x: number;
    disabilityScore: number;
  }>
) {
  const [districtFacilities, setdistrictFacilities] = useState<DistrictFacilities[]>();

  useEffect(() => {
    const fetchData = async () => {
      const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";
      const response = await fetch(`${api_url}/api/dashboards/facility-count-district`, {
        method: "GET",
      });
      if (!response.ok) return;
      const data = await response.json();
      setdistrictFacilities(data.data);
    }
    fetchData();
  }, [])

  const currentDistrictData = useMemo(() => {
    if (!districtFacilities) return undefined;

    return districtFacilities.find(
      district => district.districtName === hoverInfo.districtName
    );
  }, [districtFacilities, hoverInfo.districtName]);

  return (
    <div
      className="absolute z-[9] w-[350px] "
      style={{
        left: hoverInfo.x + 10,
        top: hoverInfo.y + 10,
      }}
    >
      {currentDistrictData &&
        <PieGraph
          data={currentDistrictData}
          hoverInfo={hoverInfo}
        />
      }
    </div>
  );
}
