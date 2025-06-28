import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DisabilityIndexChart({ data }: { data: Record<string, any> }) {
  const rowCount = 5;
  const sortedDistrict = React.useMemo(() => {
    return (
      Object.entries(data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, value]) => ({ ...value }))
        .sort((a, b) => b.disabilityScore - a.disabilityScore)
    );
  }, [data]);

  const ChartContent = () => {
    const bars: ReactElement[] = [];

    let count = 0;
    for (const [idx, data] of Object.entries(sortedDistrict)) {
      if (count >= rowCount) break;

      const percentage = data.disabilityScore * 100;

      bars.push(
        <div key={idx} className="flex items-center w-full gap-2">
          <div className="text-sm min-w-16 w-24">{data.districtName}</div>
          <div className="w-40 sm:w-48 h-5 rounded overflow-hidden bg-gray-100">
            <motion.div
              className="h-5 bg-blue-500 rounded-sm"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </div>
          <motion.span
            className="text-sm text-right min-w-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {data.disabilityScore * 100}
          </motion.span>
        </div>
      );
      count++;
    }

    return (
      <div className="flex flex-col gap-2.5">
        <h3 className="mb-4 font-bold text-xs">
          Kecamatan Dengan Nilai Ketersediaan Fasum Difabel Terbaik
          <span className="text-sm text-red-500">*</span>
        </h3>
        {bars}

        <p className="text-xs font-bold text-red-500">
          * Data diambil berdasarkan hasil survey
        </p>
      </div>
    );
  };

  return (
    <>
      <motion.div
        className="hidden md:block absolute top-2.5 left-5 z-10 p-5 bg-white rounded-2xl shadow-lg w-[350px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChartContent />
      </motion.div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="md:hidden absolute flex gap-2 top-4 left-4 z-20 bg-blue-500 hover:bg-blue-600">
            <BarChart2 className="h-5 w-5" />
            Tampilkan Indeks
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl p-3 sm:p-5 shadow-lg mx-2 sm:mx-4 mt-20 max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Indeks Difabel
            </DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <ChartContent />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default React.memo(DisabilityIndexChart);
