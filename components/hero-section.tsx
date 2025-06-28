"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Glow } from "./glow";
import { Mockup, MockupFrame } from "./mockup";
import { ExploreButton } from "@/components/explore-button";
import Link from "next/link";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "glow";
}

interface HeroProps {
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({ title, description, actions, image }: HeroProps) {
  const imageSrc = image.light;

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "px-4",
        "fade-bottom overflow-hidden pb-0"
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
              {title}
            </h1>

            {/* Description */}
            <p className="text-md mx-auto my-5 relative z-10 max-w-[800px] animate-appear text-muted-foreground opacity-0 delay-100 sm:text-xl">
              {description}
            </p>

            {/* Actions */}
            <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
              <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
                <Link href={"/maps"}>
                  <ExploreButton />
                </Link>
              </div>
            </div>
          </div>

          {/* Image with Glow */}
          <div className="relative pt-12">
            <MockupFrame
              className="animate-appear opacity-0 delay-700"
              size="small"
            >
              <Mockup type="responsive">
                <Image
                  className="rounded-lg"
                  draggable={false}
                  src={imageSrc}
                  alt={image.alt}
                  width={1400}
                  height={700}
                  priority
                />
              </Mockup>
            </MockupFrame>
            <Glow
              variant="top"
              className="animate-appear-zoom opacity-0 delay-1000"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
