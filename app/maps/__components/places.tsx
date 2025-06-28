"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMapStore } from "@/stores/mapStore";
import {
  Accessibility,
  ArrowUp,
  Car,
  ChevronLeft,
  ChevronRight,
  FerrisWheel,
  Loader2,
  Layers,
  MoveVertical,
  Toilet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "sonner";

type Props = {
  totalItems: number;
  items: any[];
  itemsPerPage: number;
  loading: boolean;
  isSubmission: boolean;
};

const facilityIcons: Record<string, React.ReactNode> = {
  ramp: <FerrisWheel className="w-4 h-4" />,
  toilet: <Toilet className="w-4 h-4" />,
  lift: <ArrowUp className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  escalator: <MoveVertical className="w-4 h-4" />,
  wheelchair: <Accessibility className="w-4 h-4" />,
};

const facilityColors: Record<string, string> = {
  ramp: "bg-sky-400",
  toilet: "bg-pink-400",
  lift: "bg-emerald-400",
  parking: "bg-yellow-400",
  escalator: "bg-orange-400",
  wheelchair: "bg-indigo-400",
};

const Places = ({
  items,
  itemsPerPage,
  totalItems,
  loading,
  isSubmission,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentItems = items;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) - 1 : 0;
  });

  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const setDestinationCoordinates = useMapStore(
    (state) => state.setDestinationCoordinates
  );

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNumber = pageParam ? parseInt(pageParam) - 1 : 0;

    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [searchParams, currentPage]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    if (newPage === currentPage + 1) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params}`);
    setCurrentPage(selected);
  };

  const handlePlaceClick = (
    id: number,
    latitude: number,
    longitude: number
  ) => {
    if (!latitude && !longitude)
      return toast.error("Koordinat lokasi tidak ditemukan!");

    setDestinationCoordinates(latitude, longitude);
    setActiveCardId(id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="lg:pr-4 h-[calc(100vh-320px)] md:h-[calc(100vh-260px)]">
            {currentItems?.map((place) => (
              <div
                key={place.id}
                className={`grid mt-2 grid-cols-2 gap-4 rounded-lg p-2 cursor-pointer group
                    ${
                      activeCardId === place.id
                        ? "border-blue-500"
                        : "border-transparent"
                    }
                    border hover:border-blue-500`}
                onClick={() =>
                  handlePlaceClick(place.id, place.latitude, place.longitude)
                }
              >
                <div className="relative w-full h-[200px]">
                  <Image
                    src={place.image ?? null}
                    alt={"image " + place.name}
                    sizes="100%"
                    fill
                    loading="lazy"
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1
                    className={`font-semibold text-xl ${
                      activeCardId === place.id
                        ? "text-blue-500"
                        : "group-hover:text-blue-500"
                    }`}
                  >
                    {place.name.length > 20
                      ? place.name.slice(0, 20) + "..."
                      : place.name}
                  </h1>
                  <p className="text-muted-foreground text-justify text-sm sm:hidden">
                    {place.address.length > 100
                      ? place.address.slice(0, 100) + "..."
                      : place.address}
                  </p>
                  <p className="hidden sm:block lg:hidden text-muted-foreground text-justify text-sm">
                    {place.address.length > 70
                      ? place.address.slice(0, 70) + "..."
                      : place.address}
                  </p>
                  <p className="hidden sm:block lg:hidden text-muted-foreground text-justify text-sm">
                    {place.address.length > 150
                      ? place.address.slice(0, 150) + "..."
                      : place.address}
                  </p>
                  <p className="hidden lg:block xl:hidden text-muted-foreground text-justify text-sm">
                    {place.address.length > 80
                      ? place.address.slice(0, 80) + "..."
                      : place.address}
                  </p>
                  <p className="hidden xl:block text-muted-foreground text-justify text-sm">
                    {place.address.length > 140
                      ? place.address.slice(0, 140) + "..."
                      : place.address}
                  </p>

                  {place.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {place.facilities.map((facility: any) => (
                        <div
                          key={facility.facility.id}
                          className={`${
                            facilityColors[facility.facility.name] ||
                            "bg-gray-500"
                          }
                                   text-white rounded-lg shadow-md p-2
                                   flex items-center justify-center text-center`}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {facilityIcons[facility.facility.name] || (
                                  <Layers className="w-4 h-4" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{facility.facility.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isSubmission && (
                    <div className="pt-4 lg:hidden self-end mt-auto">
                      <Link
                        href={"/maps/" + place.id}
                        className={
                          "rounded-lg px-3 py-2 bg-gray-100 text-sm font-medium hover:text-blue-500 transition-all duration-200 ease-in-out"
                        }
                      >
                        Detail Lokasi
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="py-4">
            <ReactPaginate
              className="flex items-start w-full gap-4"
              breakLabel="..."
              nextLabel={<ChevronRight />}
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              forcePage={currentPage}
              pageClassName="rounded-lg cursor-pointer hover:bg-gray-200"
              pageLinkClassName="block px-4 py-2 w-full h-full"
              activeClassName="!bg-blue-500 text-white"
              previousClassName="rounded-lg cursor-pointer hover:bg-gray-200"
              previousLinkClassName="block p-2 w-full h-full"
              nextClassName="rounded-lg cursor-pointer hover:bg-gray-200"
              nextLinkClassName="block p-2 w-full h-full"
              disabledClassName="text-muted-foreground hover:bg-transparent hover:cursor-default"
              previousLabel={<ChevronLeft />}
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
