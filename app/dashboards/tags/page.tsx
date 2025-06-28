"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import DataTable from "../__components/tags-table/data-table";
import { columns } from "../__components/tags-table/columns";
import LoadingState from "@/components/loading-state";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTags } from "@/queries/tagQuery";

const formSchema = z.object({
  name: z.string({
    message: "Nama wajib diisi",
  }),
});

const Page = () => {
  const { data, isLoading } = useTags();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreate = async (data: any) => {
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL ?? ""}/api/tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: handleCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-tags"] });
      toast.success("Tag berhasil ditambahkan");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Gagal menambahkan tag");
      console.error(error);
    },
  });

  const resetForm = () => {
    form.setValue("name", "");
  };

  const handleSubmit = (e: z.infer<typeof formSchema>) => {
    mutate(e);
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
              <BreadcrumbPage>Tag Lokasi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Tag Lokasi</h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              Kelola data tag lokasi difabel dengan mudah dan efisien.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                <Plus className="mr-2 size-4" /> Tambah Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Tambah Tag Lokasi</DialogTitle>
                <DialogDescription>
                  Lengkapi form untuk menambahkan data.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 py-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Nama</FormLabel>
                        <FormControl className="col-span-3">
                          <Input placeholder="Masukkan nama..." {...field} />
                        </FormControl>
                        <FormMessage className="col-start-2 col-span-3" />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => setOpen(false)}
                      className="cursor-pointer"
                      disabled={isPending}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                      disabled={isPending}
                    >
                      {isPending ? "Loading..." : "Simpan"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Separator />

        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <LoadingState color="blue" />
          </div>
        ) : (
          <DataTable data={data.data} columns={columns} />
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
