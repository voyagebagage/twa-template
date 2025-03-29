import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Add a fullWidth prop option
interface PhoneContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean; // For special cases that need edge-to-edge design
}

export function PhoneContainer({
  children,
  className,
  fullWidth = false,
}: PhoneContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[430px] mx-auto bg-app-background-primary min-h-screen",
        fullWidth ? "px-0" : "px-4",
        className
      )}>
      {children}
    </div>
  );
}
