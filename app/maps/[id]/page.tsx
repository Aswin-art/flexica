"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  X,
  MapPin,
  FerrisWheel,
  Toilet,
  ArrowUp,
  Car,
  ZoomIn,
  Ban,
  MoveVertical,
  Accessibility,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare,
  Share,
  Clipboard,
  Check,
} from "lucide-react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  LineIcon,
  LineShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import LoadingState from "@/components/loading-state";
import { useParams, useRouter } from "next/navigation";
import { useDetailLocation } from "@/queries/placeQuery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { id } = useParams();
  const { data, isLoading } = useDetailLocation(id as string);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const client = useQueryClient();

  const { user, isSignedIn } = useUser();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "";

  const handleCreateReport = async (value: any) => {
    try {
      const req = await fetch(`${api_url}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      if (!req.ok) throw new Error("Failed to create report");

      return await req.json();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const { mutate, isPending: isReportPending } = useMutation({
    mutationFn: handleCreateReport,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["get-detail-locations-" + id],
      });

      toast.success("Laporan Terkirim!", {
        description:
          "Laporan kamu membantu kami untuk meningkatkan kualitas informasi.",
      });

      setReportText("");
      setReportModalOpen(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Gagal mengirim laporan");
    },
  });

  const defaultCoords = { latitude: -6.1751, longitude: 106.865, zoom: 12 };
  const [viewState, setViewState] = useState<{
    longitude: number;
    latitude: number;
    zoom: number;
  } | null>(defaultCoords);

  useEffect(() => {
    if (data?.data.latitude && data?.data.longitude) {
      setViewState({
        latitude: data.data.latitude,
        longitude: data.data.longitude,
        zoom: 15,
      });
    }
  }, [data]);

  const handleReportSubmit = () => {
    if (!isSignedIn) {
      return router.push("/sign-in?redirect_url=/maps");
    }

    const reportData = {
      userId: user.id,
      notes: reportText,
      locationId: data.data.id,
    };

    mutate(reportData);
  };

  const handleCreateFeedback = async (value: any) => {
    try {
      const req = await fetch(`${api_url}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      if (!req.ok) throw new Error("Failed to create report");

      return await req.json();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const { mutate: feedbackMutate, isPending: isFeedbackPending } = useMutation({
    mutationFn: handleCreateFeedback,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["get-detail-locations-" + id],
      });

      toast.success("Feedback Terkirim!", {
        description: "Terimakasih telah memberikan ulasan!",
      });

      setFeedbackComment("");
      setFeedbackRating(null);
      setFeedbackModalOpen(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Gagal mengirim feedback!");
    },
  });

  const handleFeedbackSubmit = () => {
    if (!isSignedIn) {
      return router.push("/sign-in?redirect_url=/maps");
    }

    if (feedbackRating === null) {
      toast.error("Rating required!", {
        description:
          "Please select whether your experience was positive or negative.",
      });
      return;
    }

    const feedbackData = {
      userId: user.id,
      vote: feedbackRating,
      comment: feedbackComment,
      locationId: data.data.id,
    };

    feedbackMutate(feedbackData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !data) {
    return (
      <LoadingState
        className="absolute z-20 w-full h-full"
        color="oklch(.623 .214 259.815)"
        size={32}
      />
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/80 z-10" />

      {/* Report Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Laporkan Tempat</DialogTitle>
            <DialogDescription>
              Tolong jelaskan masalah aksesibilitas atau informasi yang tidak
              akurat tentang lokasi ini.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Jelaskan masalah dengan detail..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="min-h-32"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleReportSubmit}
              disabled={!reportText.trim() || isReportPending}
              className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white cursor-pointer"
            >
              {isReportPending ? "Loading..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ceritakan pengalamanmu</DialogTitle>
            <DialogDescription>
              Apakah lokasi ini sesuai dengan deskripsi? Masukan Anda akan
              membantu pengguna lain.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                variant={feedbackRating === true ? "default" : "outline"}
                className={`flex flex-col items-center px-6 py-10 cursor-pointer w-full sm:w-40 ${
                  feedbackRating === true
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }`}
                onClick={() => setFeedbackRating(true)}
              >
                <ThumbsUp className="w-8 h-8 mb-1" />
                <span>Positive</span>
              </Button>
              <Button
                variant={feedbackRating === false ? "default" : "outline"}
                className={`flex flex-col items-center px-6 py-10 cursor-pointer w-full sm:w-40 ${
                  feedbackRating === false ? "bg-red-600 hover:bg-red-700" : ""
                }`}
                onClick={() => setFeedbackRating(false)}
              >
                <ThumbsDown className="w-8 h-8 mb-1" />
                <span>Negative</span>
              </Button>
            </div>
            <Textarea
              placeholder="Jelaskan secara detail pengalamanmu..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              className="min-h-24"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleFeedbackSubmit}
              disabled={!feedbackComment.trim() || isFeedbackPending}
              className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white cursor-pointer self-end"
            >
              {isFeedbackPending ? "Loading..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                onClick={() => setIsOpen(false)}
                size="icon"
                variant="ghost"
                className="cursor-pointer"
              >
                <X className="size-6" />
              </Button>
            </div>

            <ScrollArea className="h-full mt-4 p-4">
              <div className="mx-auto max-w-2xl">
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold text-2xl">{data.data.name}</h1>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setReportModalOpen(true)}
                      variant="outline"
                      className="flex items-center gap-4 justify-center cursor-pointer bg-red-500 hover:bg-red-700 text-white hover:text-white"
                    >
                      <Flag className="w-4 h-4" />
                      <span className="hidden sm:inline">Laporkan</span>
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-4 justify-center cursor-pointer bg-gray-100 border-none hover:bg-gray-100 hover:text-blue-500"
                        >
                          <Share className="w-6 h-6" />
                          <span className="hidden sm:inline">Bagikan</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xs">
                        <DialogHeader>
                          <DialogTitle>Bagikan ke</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-around mt-4">
                          <WhatsappShareButton url={shareUrl}>
                            <WhatsappIcon size={52} round />
                          </WhatsappShareButton>
                          <TelegramShareButton url={shareUrl}>
                            <TelegramIcon size={52} round />
                          </TelegramShareButton>
                          <LineShareButton url={shareUrl}>
                            <LineIcon size={52} round />
                          </LineShareButton>
                          <TwitterShareButton url={shareUrl}>
                            <TwitterIcon size={52} round />
                          </TwitterShareButton>
                        </div>
                        <div className="mt-6 flex flex-col md:flex-row items-center gap-2">
                          <input
                            readOnly
                            value={shareUrl}
                            className="flex-1 border rounded-lg px-2 py-2 text-sm"
                          />
                          <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="flex items-center gap-4 justify-center cursor-pointer bg-blue-500 border-none hover:bg-blue-700 text-white hover:text-white"
                          >
                            <span className="hidden sm:inline">Salin url</span>
                            {copied ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Clipboard className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="relative w-full h-72 rounded-lg overflow-hidden">
                  <Image
                    src={data.data.image ?? "https://via.placeholder.com/400"}
                    alt={data.data.name}
                    fill
                    sizes="100%"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>

                <div className="mt-8">
                  <h2 className="font-semibold text-xl mb-4">Fasilitas</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {data.data.facilities.length === 0 && (
                      <div className="col-span-2 sm:col-span-3 text-center text-muted-foreground">
                        Tidak ada fasilitas yang tersedia
                      </div>
                    )}
                    {data.data.facilities.map((fac: any) => (
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

                <div className="mt-8">
                  <h2 className="font-semibold text-xl mb-4">Foto Fasilitas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.data.facilities.length === 0 && (
                      <div className="col-span-1 sm:col-span-2 text-center text-muted-foreground">
                        Tidak ada foto fasilitas yang tersedia
                      </div>
                    )}
                    {data.data.facilities.map((fac: any, idx: number) =>
                      fac.image ? (
                        <div
                          key={`image-${fac.facility.id}`}
                          onClick={() => setOpenIndex(idx)}
                          className="group block relative cursor-pointer"
                        >
                          <div className="relative h-48 w-full overflow-hidden rounded-lg shadow-md">
                            <Image
                              src={fac.image}
                              alt={`Foto ${fac.facility.name}`}
                              fill
                              loading="lazy"
                              sizes="100%"
                              className="object-cover filter transition-filter duration-300 group-hover:blur-sm"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <span className="text-white font-medium capitalize mr-2">
                                {fac.facility.name}
                              </span>
                              <ZoomIn size={24} className="text-white" />
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>

                {openIndex !== null && (
                  <Lightbox
                    open={openIndex !== null}
                    close={() => setOpenIndex(null)}
                    index={openIndex}
                    slides={data.data.facilities.map((fac: any) => ({
                      src: fac.image,
                    }))}
                  />
                )}

                <div className="mt-8">
                  <h2 className="font-semibold text-xl mb-4">Peta Lokasi</h2>
                  {viewState && (
                    <div className="w-full h-72 rounded-lg overflow-hidden border border-gray-200">
                      <Map
                        {...viewState}
                        mapStyle={`https://basemap.mapid.io/styles/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`}
                        mapboxAccessToken={
                          process.env.NEXT_PUBLIC_MAPBOX_API_KEY
                        }
                      >
                        <Marker
                          longitude={data.data.longitude}
                          latitude={data.data.latitude}
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

                <div className="mt-8">
                  <h2 className="font-semibold text-xl mb-2">Deskripsi</h2>
                  <p className="text-justify">{data.data.description}</p>
                </div>

                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-xl">
                      Tanggapan Pengguna
                    </h2>
                    <Button
                      onClick={() => setFeedbackModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Berikan Tanggapan
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {data.data.Feedback.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          Belum ada tanggapan. Jadilah orang pertama yang
                          memberikan tanggapan!
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.1,
                            },
                          },
                        }}
                      >
                        {data?.data?.Feedback?.map((feedback: any) => (
                          <motion.div
                            key={feedback.id}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <Card className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar>
                                  <Image
                                    src={
                                      user?.imageUrl ??
                                      "https://www.pngkey.com/png/full/73-730434_04-dummy-avatar.png"
                                    }
                                    alt={feedback.user.name}
                                    width={40}
                                    height={40}
                                    loading="lazy"
                                    className="rounded-full"
                                  />
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="font-medium">
                                      {feedback.user.name}
                                    </div>
                                    <Badge
                                      variant={
                                        feedback.vote === true
                                          ? "default"
                                          : "destructive"
                                      }
                                    >
                                      {feedback.vote === true ? (
                                        <ThumbsUp className="w-3 h-3 mr-1" />
                                      ) : (
                                        <ThumbsDown className="w-3 h-3 mr-1" />
                                      )}
                                      {feedback.vote === true
                                        ? "Positive"
                                        : "Negative"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {feedback.comment}
                                  </p>
                                  <div className="text-xs text-gray-400">
                                    {format(
                                      new Date(feedback.createdAt),
                                      "dd MMM yyyy"
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mt-8 mb-20">
                  {/* Extra space at bottom for mobile scrolling */}
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
