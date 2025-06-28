"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Map, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  MapProvider,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapStore } from "@/stores/mapStore";
import SidePanel from "./side-panel";
import { Filter } from "lucide-react";
import { Button } from "../ui/button";
import { FilterMobile } from "@/app/maps/__components/filter-mobile";
import { AnimatePresence } from "framer-motion";
import { TabValue } from "@/app/maps/page";

const Mapbox = ({
  items,
  activeTab,
  setActiveTab,
}: {
  items: any[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<TabValue>>;
}) => {
  const [viewState, setViewState] = useState({
    longitude: 112.7378,
    latitude: -7.2453,
    zoom: 12,
  });
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const destinationLat = useMapStore((state) => state.destinationLat);
  const destinationLong = useMapStore((state) => state.destinationLong);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (mapRef.current && destinationLat && destinationLong) {
      mapRef.current.flyTo({
        center: [destinationLong, destinationLat],
        duration: 2500,
        zoom: 18,
      });
    }
  }, [destinationLat, destinationLong]);

  const handleMarkerClick = (item: any) => {
    setSelectedItem(item);
  };

  const closePanel = () => setSelectedItem(null);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <MapProvider>
      <div className="relative h-screen rounded-lg flex">
        <div className="flex-1 relative">
          <div className="block lg:hidden absolute top-4 left-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg border border-gray-200/50 text-gray-700 hover:text-gray-900 transition-all duration-200 gap-2 font-medium"
              onClick={() => {
                setShowAdvancedFilters(!showAdvancedFilters);
              }}
            >
              <Filter className="h-4 w-4" />
              Filter Lanjutan
            </Button>
          </div>

          {/* Map Component */}
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            {...viewState}
            onMove={(evt: any) => setViewState(evt.viewState)}
            style={{ width: "100%", height: "100%" }}
            mapStyle={`https://basemap.mapid.io/styles/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`}
            attributionControl={true}
          >
            <FullscreenControl />
            <GeolocateControl />
            <NavigationControl />
            <AttributionControl customAttribution="Map design by Flexica Team" />

            {items?.map((item) => (
              <Marker
                key={item.id}
                longitude={item.longitude}
                latitude={item.latitude}
                anchor="bottom"
              >
                <button
                  onClick={() => handleMarkerClick(item)}
                  className="cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                >
                  <Image
                    src="/location-pin.webp"
                    alt="pin"
                    width={50}
                    height={50}
                    loading="lazy"
                  />
                </button>
              </Marker>
            ))}
          </Map>

          <AnimatePresence>
            {showAdvancedFilters && (
              <FilterMobile
                onClose={() => setShowAdvancedFilters(false)}
                setActiveTab={setActiveTab}
              />
            )}
          </AnimatePresence>
        </div>

        <SidePanel
          selectedItem={selectedItem}
          onClose={closePanel}
          activeTab={activeTab}
        />
      </div>
    </MapProvider>
  );
};

export default Mapbox;
