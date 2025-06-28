import { create } from "zustand";

interface MapState {
  destinationLat: number;
  destinationLong: number;
  setDestinationCoordinates: (lat: number, long: number) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  destinationLat: 0,
  destinationLong: 0,
  setDestinationCoordinates: (lat: number, long: number) =>
    set(() => ({
      destinationLat: lat,
      destinationLong: long,
    })),
}));
