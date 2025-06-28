import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, RefreshCw, Search } from "lucide-react";
import { useFacilities } from "@/queries/facilityQuery";
import { useTags } from "@/queries/tagQuery";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { TabValue } from "../page";

// Schema without tab
const mobileSchema = z.object({
  place: z.string().optional(),
  facilityType: z.string().optional(),
  tag: z.string().optional(),
});

type MobileFormValues = z.infer<typeof mobileSchema>;

interface FilterMobileProps {
  onClose: () => void;
  setActiveTab: React.Dispatch<React.SetStateAction<TabValue>>;
}

export const FilterMobile: React.FC<FilterMobileProps> = ({
  onClose,
  setActiveTab,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { data: facilities, isLoading } = useFacilities();
  const { data: tags, isLoading: tagLoading } = useTags();

  const [tab, setTab] = useState<TabValue>(() => "lokasi" as TabValue);
  useEffect(() => {
    setActiveTab(tab);
  }, [tab, setActiveTab]);

  const form = useForm<MobileFormValues>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      place: searchParams.get("name") || "",
      facilityType: searchParams.get("facilities") || "all",
      tag: searchParams.get("tag") || "all",
    },
  });

  const handleReset = () => {
    form.reset({ place: "", facilityType: "all", tag: "all" });
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`${pathName}?${params.toString()}`);
  };

  const onSubmit = (values: MobileFormValues) => {
    const params = new URLSearchParams(searchParams);
    values.place ? params.set("name", values.place) : params.delete("name");
    values.facilityType !== "all"
      ? params.set("facilities", values.facilityType ? values.facilityType : "")
      : params.delete("facilities");
    values.tag !== "all"
      ? params.set("tag", values.tag ? values.tag : "")
      : params.delete("tag");
    params.set("page", "1");
    router.push(`${pathName}?${params.toString()}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-0 left-0 h-full w-80 bg-white shadow-xl p-6 flex flex-col gap-6 overflow-auto z-20"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Lanjutan</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 flex-1"
          >
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cari Lokasi</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-sm"
                      placeholder="Ketik nama lokasi..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facilityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Fasilitas</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Fasilitas</SelectItem>
                      {!isLoading &&
                        facilities?.data.map((f: any) => (
                          <SelectItem key={f.id} value={f.name}>
                            {f.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Lokasi</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={tagLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {!tagLoading &&
                        tags?.data.map((t: any) => (
                          <SelectItem key={t.id} value={t.name}>
                            {t.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Mode</FormLabel>
              <Tabs
                value={tab}
                onValueChange={(value: string) => setTab(value as TabValue)}
                className="w-full"
              >
                <TabsList>
                  <TabsTrigger value="lokasi">Lokasi</TabsTrigger>
                  <TabsTrigger value="ajuan">Ajuan</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex gap-2 items-center"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </Button>
              <Button
                type="submit"
                className="flex gap-2 items-center bg-blue-500 hover:bg-blue-600"
              >
                <Search className="h-4 w-4" /> Terapkan
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
};
