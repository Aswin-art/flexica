"use client";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useDetailSubmission } from "@/queries/placeQuery";
import LoadingState from "@/components/loading-state";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Accessibility,
  ArrowUp,
  Ban,
  Car,
  FerrisWheel,
  MapPin,
  MoveVertical,
  Toilet,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  image: z.string().min(2, {
    message: "Image must be exists.",
  }),
  address: z.string().min(2, {
    message: "Address must be exists.",
  }),
  tag: z.string().min(2, {
    message: "Tag must be exists.",
  }),
  facilities: z.array(
    z.string().min(2, {
      message: "Tag must be exists.",
    })
  ),
  userName: z.string().min(2, {
    message: "User name must be exists.",
  }),
  userEmail: z.string().min(2, {
    message: "User email must be exists.",
  }),
});

const facilityIcons: Record<string, React.ReactNode> = {
  ramp: <FerrisWheel className="w-6 h-6" />,
  toilet: <Toilet className="w-6 h-6" />,
  lift: <ArrowUp className="w-6 h-6" />,
  parking: <Car className="w-6 h-6" />,
  escalator: <MoveVertical className="w-6 h-6" />,
  wheelchair: <Accessibility className="w-6 h-6" />,
};

const facilityColors: Record<string, string> = {
  ramp: "bg-blue-500",
  toilet: "bg-purple-500",
  lift: "bg-green-500",
  parking: "bg-yellow-500",
  escalator: "bg-orange-500",
  wheelchair: "bg-blue-500",
};

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      address: "",
      userEmail: "",
      userName: "",
      tag: "",
      facilities: [],
    },
  });

  const [viewState, setViewState] = useState<{
    longitude: number;
    latitude: number;
    zoom: number;
  } | null>(null);

  const params = useParams();

  const { data, isLoading } = useDetailSubmission(params.id as string);

  const handleVerified = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/submissions/accept/${
          params.id as string
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: handleVerified,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "get-potentials",
          ("get-detail-submissions-" + params.id) as string,
        ],
      });
      toast.success("Data berhasil diperbarui!");
    },
    onError: () => {
      toast.error("Data gagal diperbarui!");
    },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset(data?.data);
      form.setValue("userEmail", data?.data.user.email);
      form.setValue("userName", data?.data.user.name);
      form.setValue("tag", data?.data.tag.name);
    }

    if (data?.data.latitude && data?.data.longitude) {
      setViewState({
        latitude: data?.data.latitude,
        longitude: data?.data.longitude,
        zoom: 15,
      });
    }
  }, [data]);

  return (
    <ScrollArea className="h-full mt-15 md:mt-0">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboards">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboards/submissions">
                Ajuan Fasum
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail Ajuan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Detail Ajuan</h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Detail informasi pengajuan fasilitas umum untuk difabel.
            </p>
          </div>
        </div>
        <Separator />

        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <LoadingState color="blue" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={() => mutate()} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gambar Lokasi</FormLabel>
                      <FormControl>
                        <div className="relative w-full h-[400px]">
                          {field.value ? (
                            <Image
                              src={field.value}
                              alt="submission image"
                              className="object-cover rounded-lg"
                              loading="lazy"
                              fill
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-black text-sm">
                              Tidak ada gambar
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lokasi</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag Lokasi</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Lokasi</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled
                            placeholder="Alamat lokasi..."
                            className="min-h-20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Fasum yang Diajukan</FormLabel>

                        {data?.data.facilities.length === 0 ? (
                          <div className="text-center text-muted-foreground py-4">
                            Tidak ada fasilitas yang tersedia
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {data?.data.facilities.map((fac: any) => (
                              <div
                                key={fac?.facility?.name}
                                className={`${
                                  facilityColors[fac.facility.name] ||
                                  "bg-gray-500"
                                } text-white p-4 rounded-xl shadow flex flex-col items-center justify-center text-center`}
                              >
                                <div className="mb-2">
                                  {facilityIcons[fac.facility.name] || (
                                    <Ban className="w-6 h-6" />
                                  )}
                                </div>
                                <div className="font-semibold capitalize">
                                  {fac.facility.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="userEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Pengguna</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Pengguna</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan Pengajuan</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled
                            placeholder="Catatan yang ingin ditambahkan"
                            className="min-h-60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="font-semibold text-xl mb-4">Peta Lokasi</h2>
                  {viewState && (
                    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                      <Map
                        {...viewState}
                        mapStyle={`https://basemap.mapid.io/styles/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`}
                        mapboxAccessToken={
                          process.env.NEXT_PUBLIC_MAPBOX_API_KEY
                        }
                      >
                        <Marker
                          longitude={data?.data.longitude}
                          latitude={data?.data.latitude}
                          anchor="bottom"
                        >
                          <MapPin
                            className="w-8 h-8 text-red-600"
                            fill="currentColor"
                            stroke="white"
                            strokeWidth={2}
                          />
                        </Marker>
                      </Map>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={"/dashboards/submissions"}
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Kembali
                </Link>
                {data?.data.status == false ? (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  >
                    {isPending ? "Loading..." : "Setujui Pengajuan"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={true}
                    className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  >
                    Telah Disetujui
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </div>
    </ScrollArea>
  );
}
