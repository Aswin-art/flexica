"use client";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";
import NotFoundIllustration from "@/components/not-found-illustration";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-lg text-center space-y-8 animate-fade-in">
        <div className="relative">
          <NotFoundIllustration />
          <h1 className="text-6xl md:text-7xl font-bold text-blue-600 mt-6 mb-2">
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            variant="outline"
            className="group border-blue-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
            Go Back
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>

      <div className="mt-16 text-gray-500 text-sm">
        <p>{"Lost? Don't worry, it happens to the best of us."}</p>
      </div>
    </div>
  );
};

export default NotFound;
