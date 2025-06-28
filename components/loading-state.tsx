"use client";
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  size?: number;
  color?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin" size={size} color={color} />
    </div>
  );
};

export default LoadingState;
