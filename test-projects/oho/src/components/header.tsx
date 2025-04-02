"use client";

import { ChevronDown, MoreHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/hooks/use-telegram";
import { cn } from "@/lib/utils";
import { isIOS } from "@/lib/utils";

interface HeaderProps {
  title: string;
  onClose?: () => void;
  onMenuOpen?: () => void;
  onOptionsOpen?: () => void;
  className?: string;
}

export function Header({
  title,
  onClose,
  onMenuOpen,
  onOptionsOpen,
  className,
}: HeaderProps) {
  const { t } = useTranslation();
  const { tg } = useTelegram();

  // Check if platform is iOS
  const isPlatformIOS = isIOS();

  // Use standard iOS header height (status bar + nav bar)
  // iOS status bar is ~44px for notched devices plus standard 44px nav height
  const headerHeight = isPlatformIOS ? "h-[95px]" : "h-[65px]";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex flex-none w-full items-end justify-center bg-app-background-primary/70 backdrop-blur-lg px-4 pb-2 app-header",
        headerHeight,
        className
      )}>
      <h1 className="text-lg font-bold text-white">{title}</h1>
    </header>
  );
}
