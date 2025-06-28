"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Filter,
  Search,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useFacilities } from "@/queries/facilityQuery";
import { useTags } from "@/queries/tagQuery";

const searchSchema = z.object({
  place: z.string().optional(),
  facilityType: z.string().optional(),
  tag: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function FilterForm() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isAscending, setIsAscending] = useState(false);
  const { data: facilities, isLoading } = useFacilities();
  const { data: tags, isLoading: tagLoading } = useTags();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      place: searchParams.get("name") || "",
      facilityType: searchParams.get("facilities") || "all",
      tag: searchParams.get("tag") || "all",
    },
  });

  const toggleSortOrder = () => setIsAscending((prev) => !prev);

  const createUrl = (params: URLSearchParams) => {
    return `${pathName}?${params.toString()}`;
  };

  const handleSearchSubmit = (values: SearchFormValues) => {
    setIsSubmitting(true);

    const params = new URLSearchParams(searchParams);

    if (values.place) {
      params.set("name", values.place);
    } else {
      params.delete("name");
    }

    if (values.facilityType && values.facilityType !== "all") {
      params.set("facilities", values.facilityType);
    } else {
      params.delete("facilities");
    }

    if (values.tag && values.tag !== "all") {
      params.set("tag", values.tag);
    } else {
      params.delete("tag");
    }

    if (isAscending) {
      params.set("sort_asc", "true");
    } else {
      params.delete("sort_asc");
    }

    params.set("page", "1");

    router.push(createUrl(params));
    setIsFilterDialogOpen(false);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  const resetFilters = () => {
    form.reset({
      place: "",
      facilityType: "all",
      tag: "all",
    });

    setIsAscending(false);

    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(createUrl(params));

    setIsFilterDialogOpen(false);
  };

  useEffect(() => {
    setIsAscending(searchParams.get("sort_asc") === "true");
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSearchSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ketik nama tempat..."
                      className="w-full p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="p-6 cursor-pointer bg-blue-500 hover:bg-blue-700 h-[50px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2" />
              )}
              Cari Lokasi
            </Button>
          </div>

          <Dialog
            open={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-[50px] p-6 cursor-pointer border border-gray-300 hover:bg-gray-100"
              >
                <Filter className="mr-2" />
                Filter Lanjutan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Pilih Jenis Filter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Facility Type - Using Select instead of Popover+Command */}
                <FormField
                  control={form.control}
                  name="facilityType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Jenis Fasilitas</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full p-6 h-[50px] cursor-pointer hover:bg-gray-100">
                          <SelectValue placeholder="Pilih fasilitas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="all"
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            Semua Fasilitas
                          </SelectItem>
                          {!isLoading &&
                            facilities?.data?.map((facility: any) => (
                              <SelectItem
                                key={facility.id}
                                value={facility.name}
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                {facility.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tag - Using Select instead of Popover+Command */}
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Kategori Lokasi</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={tagLoading}
                      >
                        <SelectTrigger className="w-full p-6 h-[50px] cursor-pointer hover:bg-gray-100">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="all"
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            Semua Kategori
                          </SelectItem>
                          {!tagLoading &&
                            tags?.data?.map((tag: any) => (
                              <SelectItem
                                key={tag.id}
                                value={tag.name}
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                {tag.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sorting */}
                <div className="w-full">
                  <FormLabel>Urutan</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleSortOrder}
                    className={cn(
                      "w-full h-[50px] cursor-pointer",
                      isAscending && "border-blue-500"
                    )}
                  >
                    {isAscending ? (
                      <ArrowUpAZ className="mr-2" />
                    ) : (
                      <ArrowDownAZ className="mr-2" />
                    )}
                    {isAscending ? "A-Z (Ascending)" : "Z-A (Descending)"}
                  </Button>
                </div>
              </div>
              <DialogFooter className="flex justify-between sm:justify-between flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="cursor-pointer"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Filter
                </Button>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSearchSubmit)}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SlidersHorizontal className="mr-2" />
                  )}
                  Terapkan Filter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}
