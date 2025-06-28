"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { useFacilities } from "@/queries/facilityQuery";
import { useTags } from "@/queries/tagQuery";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { X, Plus, ZoomIn } from "lucide-react";
import Map, { NavigationControl, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type FacilityItem = {
  id: string;
  facilityId: string;
  facilityName: string;
  image: string;
};

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Location name must be at least 3 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  image: z.string({ required_error: "Please upload a location image." }),
  tagId: z.string({ required_error: "Please select a tag location." }),
  facilities: z
    .array(
      z.object({
        id: z.string(),
        facilityId: z.string(),
        facilityName: z.string(),
        image: z.string(),
      })
    )
    .default([]),
  latitude: z.number({
    required_error: "Please select a location on the map.",
  }),
  longitude: z.number({
    required_error: "Please select a location on the map.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const [viewState, setViewState] = useState({
    latitude: -7.2658,
    longitude: 112.7344,
    zoom: 11,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: -7.2658,
    longitude: 112.7344,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFacilityImage, setCurrentFacilityImage] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedFacilityName, setSelectedFacilityName] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const router = useRouter();

  const { data: facilities } = useFacilities();
  const { data: tags } = useTags();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      image: "",
      tagId: "",
      facilities: [],
      latitude: -7.2658,
      longitude: 112.7344,
    },
  });

  async function addLocation(data: FormValues) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/locations`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) throw new Error("Failed to add location");
    return res.json();
  }

  const { mutate, isPending } = useMutation({
    mutationFn: addLocation,
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!");
      form.reset();
      router.push("/dashboards/locations");
    },
    onError: () => {
      toast.error("Gagal menambahkan lokasi. Tolong coba lagi.");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values);
  };

  useEffect(() => {
    form.setValue("latitude", markerPosition.latitude);
    form.setValue("longitude", markerPosition.longitude);
  }, [markerPosition, form]);

  const addFacility = () => {
    if (!selectedFacility || !currentFacilityImage) {
      toast.error("Pilih jenis fasilitas dan unggah gambar terlebih dahulu");
      return;
    }

    const newFacility: FacilityItem = {
      id: crypto.randomUUID(),
      facilityId: selectedFacility,
      facilityName: selectedFacilityName,
      image: currentFacilityImage,
    };

    const currentFacilities = form.getValues("facilities");
    form.setValue("facilities", [...currentFacilities, newFacility]);

    setCurrentFacilityImage("");
    setSelectedFacility("");
    setSelectedFacilityName("");
    setIsDialogOpen(false);

    toast.success("Fasilitas berhasil ditambahkan");
  };

  const removeFacility = (id: string) => {
    const currentFacilities = form.getValues("facilities");
    form.setValue(
      "facilities",
      currentFacilities.filter((facility) => facility.id !== id)
    );
    toast.success("Fasilitas berhasil dihapus");
  };

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
              <BreadcrumbLink href="/dashboards/locations">
                Lokasi Fasum
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tambah Data Lokasi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Form Penambahan Data
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Lengkapi form dibawah ini untuk menambah data lokasi baru.
            </p>
          </div>
        </div>
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mb-28"
          >
            {/* Image (single URL) */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Gambar Lokasi <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    {field.value ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="relative w-full h-[500px]">
                          <Image
                            src={field.value ?? null}
                            alt="submission image"
                            className="object-contain"
                            loading="lazy"
                            fill
                          />
                        </div>

                        <Button
                          variant={"ghost"}
                          type="button"
                          className="cursor-pointer"
                          onClick={() => form.setValue("image", "")}
                        >
                          <X className="w-4 h-4" /> Hapus
                        </Button>
                      </div>
                    ) : (
                      <UploadDropzone
                        disabled={form.formState.isSubmitting}
                        endpoint="locations"
                        className="relative w-full h-[500px]"
                        onClientUploadComplete={(res) => {
                          form.setValue("image", res[0].url);
                        }}
                        onUploadError={(error) =>
                          console.error("Upload error:", error)
                        }
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nama Lokasi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Masukkan nama lokasi"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Alamat Lokasi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Masukkan alamat lengkap"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fasum Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>
                    Fasilitas Umum <span className="text-red-500">*</span>
                  </FormLabel>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Tambah Fasilitas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tambah Fasilitas Umum</DialogTitle>
                        <DialogDescription>
                          Pilih jenis fasilitas dan unggah gambar fasilitas
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <FormLabel>Jenis Fasilitas</FormLabel>
                          <Select
                            value={selectedFacility}
                            onValueChange={(value) => {
                              setSelectedFacility(value);
                              const facilityName = facilities?.data?.find(
                                (f: any) => f.id === value
                              )?.name;
                              setSelectedFacilityName(facilityName || "");
                            }}
                          >
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Pilih jenis fasilitas" />
                            </SelectTrigger>
                            <SelectContent>
                              {facilities?.data?.map((facility: any) => (
                                <SelectItem
                                  key={facility.id}
                                  value={facility.id}
                                  className="cursor-pointer hover:bg-gray-100"
                                >
                                  {facility.name}
                                </SelectItem>
                              )) || (
                                <SelectItem value="loading">
                                  Loading...
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Gambar Fasilitas</FormLabel>
                          {currentFacilityImage ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="relative w-full h-[300px]">
                                <Image
                                  src={currentFacilityImage}
                                  alt="facility image"
                                  className="object-contain"
                                  loading="lazy"
                                  fill
                                />
                              </div>
                              <Button
                                variant={"ghost"}
                                type="button"
                                className="cursor-pointer"
                                onClick={() => setCurrentFacilityImage("")}
                              >
                                <X className="w-4 h-4" /> Hapus
                              </Button>
                            </div>
                          ) : (
                            <UploadDropzone
                              endpoint="facilities"
                              className="relative w-full h-[300px]"
                              onClientUploadComplete={(res) => {
                                setCurrentFacilityImage(res[0].url);
                              }}
                              onUploadError={(error) =>
                                console.error("Upload error:", error)
                              }
                            />
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsDialogOpen(false)}
                          className="cursor-pointer"
                        >
                          Batal
                        </Button>
                        <Button
                          type="button"
                          onClick={addFacility}
                          disabled={!selectedFacility || !currentFacilityImage}
                          className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        >
                          Tambahkan
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Display Added Facilities */}
                <FormField
                  control={form.control}
                  name="facilities"
                  render={({ field }) => (
                    <FormItem>
                      {field.value.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Belum ada fasilitas yang ditambahkan
                        </p>
                      ) : (
                        <div className="space-y-2 mb-4">
                          {field.value.map((facility, index) => (
                            <div
                              key={facility.id}
                              className="flex items-center justify-between border rounded-md p-2 w-full"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="relative h-16 w-16 overflow-hidden rounded-md group cursor-pointer"
                                  onClick={() => {
                                    setLightboxIndex(index);
                                    setLightboxOpen(true);
                                  }}
                                >
                                  <Image
                                    src={facility.image}
                                    alt={facility.facilityName}
                                    fill
                                    className="object-cover filter transition-filter duration-300 group-hover:blur-sm"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <ZoomIn size={24} className="text-white" />
                                  </div>
                                </div>
                                <p className="font-medium">
                                  {facility.facilityName}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={() => removeFacility(facility.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}

                          <Lightbox
                            open={lightboxOpen}
                            close={() => setLightboxOpen(false)}
                            index={lightboxIndex}
                            slides={field.value.map((facility) => ({
                              src: facility.image,
                            }))}
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Deskripsi Tempat <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={form.formState.isSubmitting}
                        placeholder="Tuliskan deskripsi"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tag */}
              <div>
                <FormLabel className="mb-2">
                  Tag Lokasi <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Controller
                    control={form.control}
                    name="tagId"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-[50px] w-full cursor-pointer">
                          <SelectValue placeholder="Pilih tag lokasi" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags?.data?.map((tag: any) => (
                            <SelectItem
                              key={tag.id}
                              value={tag.id}
                              className="cursor-pointer"
                            >
                              {tag.name}
                            </SelectItem>
                          )) || (
                            <SelectItem value="loading">Loading...</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Map */}
            <FormItem>
              <FormLabel>
                Lokasi di Map <span className="text-red-500">*</span>
              </FormLabel>
              <div className="h-96 w-full rounded-md border overflow-hidden">
                <Map
                  {...viewState}
                  onMove={(evt: any) => setViewState(evt.viewState)}
                  mapStyle={`https://basemap.mapid.io/styles/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`}
                  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
                  onClick={(evt: any) =>
                    setMarkerPosition({
                      longitude: evt.lngLat.lng,
                      latitude: evt.lngLat.lat,
                    })
                  }
                >
                  <NavigationControl position="top-right" />
                  <Marker
                    longitude={markerPosition.longitude}
                    latitude={markerPosition.latitude}
                    draggable
                    onDragEnd={(evt: any) =>
                      setMarkerPosition({
                        longitude: evt.lngLat.lng,
                        latitude: evt.lngLat.lat,
                      })
                    }
                    color="red"
                  />
                </Map>
              </div>
              <FormDescription>
                Klik pada peta atau seret penanda untuk menetapkan lokasi
              </FormDescription>
              {(form.formState.errors.latitude ||
                form.formState.errors.longitude) && (
                <FormMessage>Mohon pilih lokasi pada peta</FormMessage>
              )}
            </FormItem>

            <div className="flex gap-2">
              <Link
                href={"/dashboards/locations"}
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                Kembali
              </Link>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
              >
                {isPending ? "Loading..." : "Tambahkan Data"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default Page;
