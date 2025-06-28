"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button, buttonVariants } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Map, { NavigationControl, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useFacilities } from "@/queries/facilityQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";

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
  facilities: z.array(z.string()).default([]),
  latitude: z.number({
    required_error: "Please select a location on the map.",
  }),
  longitude: z.number({
    required_error: "Please select a location on the map.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [viewState, setViewState] = useState({
    latitude: -7.2658,
    longitude: 112.7344,
    zoom: 11,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: -7.2658,
    longitude: 112.7344,
  });

  const { user, isSignedIn } = useUser();

  const { data } = useFacilities();

  const handleGetTags = async () => {
    try {
      const tags = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL ?? ""}/api/tags`
      );

      return await tags.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const { data: tags } = useQuery({
    queryKey: ["get-tags"],
    queryFn: handleGetTags,
    staleTime: 10000,
  });

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

  const facilities = form.watch("facilities");

  const addFacility = (id: string) => {
    if (!facilities.includes(id)) {
      form.setValue("facilities", [...facilities, id], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const removeFacility = (index: number) => {
    form.setValue(
      "facilities",
      facilities.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  useEffect(() => {
    form.setValue("latitude", markerPosition.latitude);
    form.setValue("longitude", markerPosition.longitude);
  }, [markerPosition, form]);

  async function addSubmission(data: FormValues) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/submissions`,
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
    mutationFn: addSubmission,
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!");
      form.reset();
      router.push("/maps");
    },
    onError: () => {
      toast.error("Gagal menambahkan lokasi. Tolong coba lagi.");
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!isSignedIn) {
      return router.push("/sign-in?redirect_url=/maps/submissions");
    }

    const submissionValues = { ...values, userId: user.id };
    mutate(submissionValues);
  };
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="h-screen w-full overflow-hidden z-10 absolute top-0 left-0 bg-black/80" />
      <AnimatePresence
        onExitComplete={() => {
          router.push("/maps");
        }}
      >
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className="h-screen w-full overflow-hidden p-8 z-20 absolute top-0 left-0 mt-10 bg-white rounded-t-4xl"
          >
            <div className="text-right">
              <Button
                variant="ghost"
                size="icon"
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                  className: "cursor-pointer",
                })}
                onClick={handleClose}
              >
                <X className="size-6" />
              </Button>
            </div>
            <ScrollArea className="h-full mt-10">
              <div className="flex flex-col w-full items-center">
                <div className="w-full max-w-2xl">
                  <h1 className="font-semibold text-2xl">
                    Ajukan Lokasi Fasum
                  </h1>
                  <Separator className="my-4" />

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6 mb-28"
                    >
                      {/* Name */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nama Lokasi{" "}
                              <span className="text-red-500">*</span>
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
                              Alamat Lokasi{" "}
                              <span className="text-red-500">*</span>
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

                      {/* Tag */}
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
                                  <SelectItem key={tag.id} value={tag.id}>
                                    {tag.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              Catatan <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={form.formState.isSubmitting}
                                placeholder="Catatan yang ingin ditambahkan"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Image (single URL) */}
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Gambar Lokasi{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              {field.value ? (
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <div className="relative w-full h-[300px]">
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
                                  onClientUploadComplete={(res) => {
                                    console.log("success", res);
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
                            mapboxAccessToken={
                              process.env.NEXT_PUBLIC_MAPBOX_API_KEY
                            }
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
                          Klik pada peta atau seret penanda untuk menetapkan
                          lokasi
                        </FormDescription>
                        {(form.formState.errors.latitude ||
                          form.formState.errors.longitude) && (
                          <FormMessage>
                            Mohon pilih lokasi pada peta
                          </FormMessage>
                        )}
                      </FormItem>

                      {/* Fasum */}
                      <FormLabel className="mb-2">
                        Fasilitas Umum <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Controller
                          control={form.control}
                          name="facilities"
                          render={() => (
                            <Select onValueChange={(val) => addFacility(val)}>
                              <SelectTrigger className="h-[50px] w-full cursor-pointer">
                                <SelectValue placeholder="Tambah fasilitas" />
                              </SelectTrigger>
                              <SelectContent>
                                {data?.data?.map((facItem: any) => (
                                  <SelectItem
                                    key={facItem.id}
                                    value={facItem.id}
                                  >
                                    {facItem.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {facilities.map((facId, idx) => {
                          const fac = data?.data?.find(
                            (f: any) => f.id === facId
                          );
                          return (
                            <span
                              key={facId}
                              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
                            >
                              {fac?.name ?? facId}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFacility(idx)}
                                className="p-0 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </span>
                          );
                        })}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                        disabled={isPending}
                      >
                        {isPending ? "Loading..." : "Ajukan Lokasi"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>

              <div className="mt-8 mb-5"></div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
