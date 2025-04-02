"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  TabIcon1,
  TabIcon2,
  TabIcon3,
  TabIcon4,
  TabIcon5,
} from "@/components/svg/tab-icons";
import { useCallback } from "react";

const tabs = [
  { name: "Tab 1", href: "/", icon: TabIcon1 },
  { name: "Tab 2", href: "/tab2", icon: TabIcon2 },
  { name: "Tab 3", href: "/tab3", icon: TabIcon3 },
  { name: "Tab 4", href: "/tab4", icon: TabIcon4 },
  { name: "Tab 5", href: "/tab5", icon: TabIcon5 },
];

export default function TabBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Custom navigation handler that ensures scroll reset
  const handleNavigation = useCallback(
    (href: string) => {
      // If this is the same page, just scroll to top
      if (pathname === href) {
        // Reset window scroll
        window.scrollTo(0, 0);

        // Reset container scroll if on this page
        document.querySelectorAll(".tab-content-scroll").forEach((element) => {
          if (element instanceof HTMLElement) {
            element.scrollTop = 0;
          }
        });

        console.log(`📱 Scrolled to top of current page: ${href}`);
      } else {
        // Hard navigation (not using Link) to ensure fresh page load and scroll reset
        window.location.href = href;

        // Also try router, though we expect the above to take priority
        router.push(href);

        console.log(`📱 Navigating to: ${href} with hard refresh`);
      }
    },
    [pathname, router]
  );

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-49 h-[75px] bg-[#030d17] border-t border-[#686e74]/60 flex flex-col justify-center items-center py-2",
        className
      )}>
      <div className="flex flex-row items-center w-full max-w-[430px] h-[54px] px-3 py-1 pb-4 gap-3">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <div
              key={tab.name}
              onClick={() => handleNavigation(tab.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 cursor-pointer",
                !isActive && "opacity-40"
              )}>
              <tab.icon
                className={cn(
                  "w-[18px] h-[18px]",
                  isActive ? "text-blue-400" : "text-[#5F6368]"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium tracking-[0.04em] uppercase",
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-white font-normal"
                )}>
                {tab.name}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
