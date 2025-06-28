"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  Ban,
  Car,
  FerrisWheel,
  ThumbsDown,
  ThumbsUp,
  Toilet,
  X,
} from "lucide-react";
import { useEffect } from "react";

interface SidePanelProps {
  selectedItem: any;
  activeTab: string;
  onClose: () => void;
}

const facilityIcons: Record<string, React.ReactNode> = {
  ramp: <FerrisWheel className="w-6 h-6" />,
  toilet: <Toilet className="w-6 h-6" />,
  lift: <ArrowUp className="w-6 h-6" />,
  parking: <Car className="w-6 h-6" />,
};

const facilityColors: Record<string, string> = {
  ramp: "bg-blue-500",
  toilet: "bg-purple-500",
  lift: "bg-green-500",
  parking: "bg-yellow-500",
};

const SidePanel: React.FC<SidePanelProps> = ({
  selectedItem,
  onClose,
  activeTab,
}) => {
  useEffect(() => {
    onClose();
  }, [activeTab]);
  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl z-20 overflow-auto"
        >
          <Card className="h-full flex flex-col">
            <CardContent className="relative p-4 flex-1">
              <button
                onClick={onClose}
                className="absolute cursor-pointer top-2 right-2 p-1 rounded-lg shadow-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  width={300}
                  height={180}
                  loading="lazy"
                  className="w-full h-44 object-cover rounded-md"
                />
              </div>

              <h2 className="text-lg font-semibold mb-2">
                {selectedItem.name}
              </h2>

              {activeTab === "submission" ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.address}
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Fasilitas umum yang diajukan:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedItem.facilities.length === 0 && (
                        <div className="col-span-2 sm:col-span-3 text-center text-muted-foreground">
                          Tidak ada fasilitas yang tersedia
                        </div>
                      )}
                      {selectedItem.facilities.map((fac: any) => (
                        <div
                          key={fac.facility.id}
                          className={`${
                            facilityColors[fac.facility.name] || "bg-gray-500"
                          }
                                   text-white p-4 rounded-lg shadow-md
                                   flex flex-col items-center text-center`}
                        >
                          <div className="mb-2">
                            {facilityIcons[fac.facility.name] || (
                              <Ban className="w-6 h-6" />
                            )}
                          </div>
                          <div className="font-medium capitalize">
                            {fac.facility.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-sm text-muted-foreground">Catatan:</p>
                    <p className="text-sm">{selectedItem.description}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-sm">Ulasan Pengunjung</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Total ulasan: {selectedItem.totalVotes}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 flex-wrap">
                    <div className="flex flex-col items-center py-3 flex-1 rounded-lg bg-green-500 text-white">
                      <ThumbsUp className="w-5 h-5 mb-1" />
                      <span className="text-sm font-bold mt-1">
                        {selectedItem.positiveVotes}
                      </span>
                    </div>
                    <div className="flex flex-col items-center py-3 flex-1 rounded-lg bg-red-500 text-white">
                      <ThumbsDown className="w-5 h-5 mb-1" />
                      <span className="text-sm font-bold mt-1">
                        {selectedItem.negativeVotes}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-5">
                    {selectedItem.description.length > 200
                      ? selectedItem.description.substring(0, 200) + "..."
                      : selectedItem.description}
                  </p>
                  <div className="p-4 flex justify-end">
                    <Link
                      href={`/maps/${selectedItem.id}`}
                      className="rounded-lg px-4 py-3 bg-gray-100 text-sm font-medium hover:text-blue-500 transition-all duration-200 ease-in-out"
                    >
                      Detail Lokasi
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
