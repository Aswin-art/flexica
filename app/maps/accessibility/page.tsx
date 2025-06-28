"use client";
import Map, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from "react-map-gl/mapbox";
import surabaya from "@/data/kecamatan-surabaya.json";
import { Source, Layer } from "react-map-gl/mapbox";
import { MapMouseEvent } from "mapbox-gl";
import heatmapData from "@/data/heatmap-data.json";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import Legend from "@/components/mapbox/legend";
import Tooltip from "@/components/mapbox/tooltip";
import DisabilityIndexChart from "@/components/mapbox/disabilityChart";

interface DistrictDisabilityScore {
  districtName: string;
  disabilityScore: number;
}

function Heatmap() {
  const [hoverInfo, setHoverInfo] = useState<{
    districtName: string;
    disabilityScore: number;
    x: number;
    y: number;
  } | null>(null);

  const [districtDisabilityScore, setDistrictDisabilityScore] = useState<
    DistrictDisabilityScore[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";
      const response = await fetch(`${api_url}/api/dashboards/district-score`, {
        method: "GET",
      });
      if (!response.ok) return;
      const data = await response.json();
      setDistrictDisabilityScore(data.data);
    };
    fetchData();
  }, []);

  const { enhancedGeoJSON } = useMemo(() => {
    const features = surabaya.features || [];

    const valueMap: { [index: string]: number } = {};

    if (!districtDisabilityScore) {
      for (const [district, value] of Object.entries(heatmapData)) {
        valueMap[district] = value;
      }
    } else {
      districtDisabilityScore.forEach(
        ({ districtName, disabilityScore }) =>
          (valueMap[districtName] = disabilityScore * 100 + 1)
      );
    }

    const enhancedData = JSON.parse(JSON.stringify(surabaya));

    enhancedData.features = features.map((feature) => {
      const districtName = feature.properties?.KECAMATAN;
      if (districtName !== undefined && valueMap[districtName]) {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            disabilityScore: valueMap[districtName],
          },
        };
      }
      return feature;
    });
    return {
      enhancedGeoJSON: enhancedData,
    };
  }, [districtDisabilityScore]);

  const onHover = useCallback((event: MapMouseEvent) => {
    const hoveredFeature = event.features?.[0];

    if (hoveredFeature && hoveredFeature.properties) {
      const districtName = hoveredFeature.properties.KECAMATAN || "Unknown";
      const disabilityScore = hoveredFeature.properties.disabilityScore || 0;
      const { x, y } = event.point;

      setHoverInfo((prev) => {
        if (prev?.districtName === districtName) return prev;
        return { districtName, disabilityScore, x, y };
      });
    } else {
      setHoverInfo((prev) => {
        if (prev === null) return prev;
        return null;
      });
    }
  }, []);

  return (
    <div className="w-full h-full mt-[60px] md:mt-0">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        initialViewState={{
          longitude: 112.7520883,
          latitude: -7.2574719,
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://basemap.mapid.io/styles/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`}
        interactiveLayerIds={["district-fills"]}
        onMouseMove={onHover}
      >
        <DisabilityIndexChart data={districtDisabilityScore} />
        <FullscreenControl />
        <GeolocateControl />
        <NavigationControl />

        <Source id="districts" type="geojson" data={enhancedGeoJSON}>
          <Layer
            id="district-fills"
            type="fill"
            paint={{
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "disabilityScore"],
                0, // No Fasum
                "#ffffcc",
                26, // Little to no Fasum
                "#a1dab4",
                51, // Some Fasum
                "#41b6c4",
                75, // Decent Fasum
                "#2c7fb8",
                100, // Perfect Fasum
                "#253494",
              ],
              "fill-opacity": 0.9,
            }}
          />
          <Layer
            id="district-labels"
            type="symbol"
            layout={{
              "text-field": ["get", "KECAMATAN"],
              "text-size": 14,
            }}
            paint={{
              "text-color": "#000",
              "text-halo-blur": 4,
              "text-halo-color": "#ffffff",
              "text-halo-width": 1,
            }}
          />
        </Source>
        {hoverInfo && <Tooltip {...hoverInfo} />}
        <Legend />
      </Map>
    </div>
  );
}

export default Heatmap;
