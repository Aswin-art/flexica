import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExploreButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const ExploreButton = React.forwardRef<HTMLButtonElement, ExploreButtonProps>(
  ({ text = "Jelajahi Peta", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative w-32 md:w-40 cursor-pointer overflow-hidden rounded-lg bg-background p-1.5 md:p-2 text-center font-semibold",
          className
        )}
        {...props}
      >
        <span className="text-xs md:text-sm inline-block translate-x-1 transition-all duration-700 group-hover:translate-x-12 group-hover:opacity-0">
          {text}
        </span>
        <div className="absolute text-xs md:text-sm top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-700 group-hover:-translate-x-1 group-hover:opacity-100">
          <span>{text}</span>
          <ArrowRight />
        </div>
        <div className="absolute left-[12%] top-[40%] md:top-[35%] h-2 w-2 md:h-2.5 md:w-2.5 scale-[1] rounded-lg bg-blue-500 hover:bg-primary transition-all duration-700 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary"></div>
      </button>
    );
  }
);

ExploreButton.displayName = "ExploreButton";

export { ExploreButton };
