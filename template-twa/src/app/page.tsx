"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTelegram } from "@/hooks/use-telegram";

/**
 * Home page component
 */
export default function Home() {
  const { tg, expand } = useTelegram();
  const [expanded, setExpanded] = useState(false);

  // Handle expand button click
  const handleExpand = () => {
    if (tg) {
      expand();
      setExpanded(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 pt-10 pb-20 text-center">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">
        Telegram Web App Template
      </h1>

      <p className="text-white/80 mb-8">
        Welcome to your new Telegram Web App. This template includes everything
        you need to build a great TWA experience.
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xs mb-8">
        <Button onClick={handleExpand} disabled={expanded}>
          {expanded ? "App Expanded!" : "Expand App"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => tg?.showAlert("Hello from Telegram Web App!")}>
          Show Alert
        </Button>
      </div>

      <div className="bg-card p-4 rounded-lg w-full max-w-xs mb-8">
        <h2 className="text-lg font-medium mb-2 text-blue-300">User Info</h2>
        <p className="text-white/70 text-sm">
          {tg?.initDataUnsafe?.user ? (
            <>
              Welcome, {tg.initDataUnsafe.user.first_name}
              {tg.initDataUnsafe.user.username &&
                ` (@${tg.initDataUnsafe.user.username})`}
              !
            </>
          ) : (
            "No user data available"
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-muted p-3 rounded-lg">
          <h3 className="text-sm font-medium mb-1 text-blue-200">Platform</h3>
          <p className="text-xs text-white/60">{tg?.platform || "Unknown"}</p>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <h3 className="text-sm font-medium mb-1 text-blue-200">Version</h3>
          <p className="text-xs text-white/60">{tg?.version || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
}
