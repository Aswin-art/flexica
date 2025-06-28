"use client";

import React, { useRef, useState, useEffect } from "react";
import Map, { MapRef, Marker } from "react-map-gl/mapbox";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Navigation,
  X,
  Loader2,
  MapPinned,
  Clock,
  Accessibility,
} from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

export default function Page() {
  const mapRef = useRef<MapRef>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [currentCoord, setCurrentCoord] = useState<[number, number] | null>(
    null
  );
  const [toCoord, setToCoord] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tripDetails, setTripDetails] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const SURABAYA_CENTER: [number, number] = [112.7378, -7.2575];
  const SURABAYA_BOUNDS = {
    north: -7.1,
    south: -7.35,
    east: 112.85,
    west: 112.6,
  };

  useEffect(() => {
    mapRef.current?.flyTo({
      center: SURABAYA_CENTER,
      zoom: 12,
      duration: 2000,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentCoord([longitude, latitude]);

          if (
            latitude >= SURABAYA_BOUNDS.south &&
            latitude <= SURABAYA_BOUNDS.north &&
            longitude >= SURABAYA_BOUNDS.west &&
            longitude <= SURABAYA_BOUNDS.east
          ) {
            mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              duration: 2000,
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentCoord(SURABAYA_CENTER);
        }
      );
    } else {
      setCurrentCoord(SURABAYA_CENTER);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      searchLocation(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const searchLocation = async (q: string) => {
    if (q.length < 3) return;

    setIsLoading(true);

    try {
      const resp = await fetch(
        `https://api.openrouteservice.org/geocode/search?` +
          `api_key=${process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY}` +
          `&text=${encodeURIComponent(q)}` +
          `&boundary.rect.min_lon=${SURABAYA_BOUNDS.west}` +
          `&boundary.rect.max_lon=${SURABAYA_BOUNDS.east}` +
          `&boundary.rect.min_lat=${SURABAYA_BOUNDS.south}` +
          `&boundary.rect.max_lat=${SURABAYA_BOUNDS.north}` +
          `&size=5`
      );

      const data = await resp.json();

      const features =
        data.features?.map((feature: any) => ({
          id: feature.properties.id,
          place_name: feature.properties.label,
          center: feature.geometry.coordinates,
        })) || [];

      setSuggestions(features);
    } catch (error) {
      console.error("Error searching locations:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setToCoord(null);
    setRouteData(null);
    setTripDetails(null);
    setSuggestions([]);

    const map = mapRef.current?.getMap();
    if (map && map.getSource("route")) {
      map.removeLayer("route-line");
      map.removeSource("route");
    }

    if (currentCoord) {
      mapRef.current?.flyTo({
        center: currentCoord,
        zoom: 14,
        duration: 1000,
      });
    }
  };

  const getWheelchairFriendlyRoute = async (
    start: [number, number],
    end: [number, number]
  ) => {
    try {
      setIsLoading(true);
      const coordinates = [start, end];

      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/wheelchair/geojson",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY || "",
          },
          body: JSON.stringify({
            coordinates: coordinates,
            format: "geojson",
          }),
        }
      );

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        toast.error("Rute tidak ditemukan!");
        return null;
      }

      if (data && data.features && data.features.length > 0) {
        const { distance, duration } = data.features[0].properties.summary;
        setTripDetails({
          distance: distance / 1000,
          duration: duration / 60,
        });
      }

      return data;
    } catch (error) {
      toast.error("Rute tidak ditemukan!");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCenterPoint = (
    point1: [number, number],
    point2: [number, number]
  ): [number, number] => {
    return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
  };

  const selectDestination = async (feature: any) => {
    const dest = feature.center as [number, number];
    setToCoord(dest);
    setQuery(feature.place_name);
    setSuggestions([]);
    setIsSearchFocused(false);

    if (!currentCoord) return;

    const routeData = await getWheelchairFriendlyRoute(currentCoord, dest);
    if (routeData) {
      setRouteData(routeData);

      const centerPoint = calculateCenterPoint(currentCoord, dest);

      const lineDistance = calculateDistance(currentCoord, dest);
      const zoom = calculateZoomLevel(lineDistance);

      mapRef.current?.flyTo({
        center: centerPoint,
        zoom: zoom,
        duration: 1000,
      });
    }
  };

  const calculateDistance = (
    point1: [number, number],
    point2: [number, number]
  ): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(point2[1] - point1[1]);
    const dLon = toRad(point2[0] - point1[0]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(point1[1])) *
        Math.cos(toRad(point2[1])) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateZoomLevel = (distance: number): number => {
    if (distance < 0.5) return 15;
    if (distance < 1) return 14;
    if (distance < 3) return 13;
    if (distance < 5) return 12;
    if (distance < 10) return 11;
    return 10;
  };

  useEffect(() => {
    if (routeData && mapRef.current) {
      const map = mapRef.current.getMap();

      if (map.getSource("route")) {
        map.removeLayer("route-line");
        map.removeSource("route");
      }

      map.addSource("route", {
        type: "geojson",
        data: routeData,
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-width": 6,
          "line-color": "#3b82f6",
          "line-opacity": 0.8,
        },
      });
    }
  }, [routeData]);

  return (
    <div className="h-screen w-full relative mt-15 md:mt-0">
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        initialViewState={{
          longitude: SURABAYA_CENTER[0],
          latitude: SURABAYA_CENTER[1],
          zoom: 12,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://basemap.mapid.io/styles/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4/5 max-w-md z-10"
        >
          <div
            className={`bg-white rounded-md shadow-lg transition-all ${
              isSearchFocused || suggestions.length > 0 ? "rounded-b-none" : ""
            }`}
          >
            <div className="flex items-center p-3 relative">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 text-blue-500 absolute left-3"
                >
                  <Loader2 className="h-5 w-5" />
                </motion.div>
              ) : (
                <Search className="h-5 w-5 text-gray-500 absolute left-3" />
              )}
              <Input
                placeholder="Mau kemana hari ini?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="border-none pl-8 pr-8 py-2 focus:ring-0 shadow-none flex-grow"
              />
              {query && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center"
                >
                  <Button
                    variant="ghost"
                    onClick={clearSearch}
                    className="h-8 w-8 p-0"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {(suggestions.length > 0 ||
              (isSearchFocused && query.length >= 1)) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-t border-gray-200 shadow-lg rounded-b-md overflow-hidden"
              >
                {suggestions.length > 0 ? (
                  <ul className="max-h-60 overflow-auto">
                    {suggestions.map((f) => (
                      <motion.li
                        key={f.id}
                        className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors duration-200"
                        onClick={() => selectDestination(f)}
                      >
                        <div className="flex items-center">
                          <MapPinned className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{f.place_name}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {query.length < 3 ? (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Ketik minimal 3 karakter untuk mencari...
                      </div>
                    ) : isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Mencari lokasi...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Tidak ada hasil di Surabaya untuk &quot;{query}&quot;
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {tripDetails && toCoord && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-lg p-4 max-w-md w-4/5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Accessibility className="h-4 w-4 mr-2 text-blue-500" />
                    Rute Ramah Difabel
                  </h3>
                  <div className="text-sm text-gray-600 mt-2 flex flex-col space-y-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{tripDetails.distance.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{Math.round(tripDetails.duration)} menit</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center cursor-pointer"
                >
                  <X className="h-4 w-4 mr-1" />
                  Batal
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentCoord && (
          <Marker longitude={currentCoord[0]} latitude={currentCoord[1]}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          </Marker>
        )}

        {toCoord && (
          <Marker longitude={toCoord[0]} latitude={toCoord[1]}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-8 h-8 -mt-8"
            >
              <div className="w-full h-full bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <Navigation className="h-4 w-4 text-white" />
              </div>
              <div className="w-2 h-2 bg-red-500 transform rotate-45 absolute -bottom-1 left-3" />
            </motion.div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
