import { useState, useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import "./styles/index.css";

function App() {
  const { tg, isInitialized, isReady, expand } = useTelegram();
  const [expanded, setExpanded] = useState(false);

  // When Telegram WebApp is ready, you can initialize your app
  useEffect(() => {
    if (isReady) {
      console.log("Telegram WebApp is ready!");
    }
  }, [isReady]);

  // Handle expand button click
  const handleExpand = () => {
    if (tg) {
      expand();
      setExpanded(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-app-background-primary text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-16 bg-app-background-primary/70 backdrop-blur-lg app-header">
        <h1 className="text-lg font-bold">Telegram Web App</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-20 pb-20 px-4 flex flex-col items-center">
        <div className="max-w-md w-full flex flex-col items-center space-y-6 text-center">
          <h2 className="text-2xl font-bold text-blue-400">Welcome!</h2>

          <p className="text-white/80">
            This is a Telegram Web App template built with Vite and React.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 w-full">
            <button
              onClick={handleExpand}
              disabled={expanded}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50">
              {expanded ? "App Expanded!" : "Expand App"}
            </button>

            <button
              onClick={() => tg?.showAlert("Hello from Telegram Web App!")}
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md">
              Show Alert
            </button>
          </div>

          <div className="bg-[#0a1624] p-4 rounded-lg w-full mt-6">
            <h3 className="text-lg font-medium mb-2 text-blue-300">
              User Info
            </h3>
            <p className="text-white/70">
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

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-[#0a1624] p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-1 text-blue-200">
                Platform
              </h4>
              <p className="text-xs text-white/60">
                {tg?.platform || "Unknown"}
              </p>
            </div>

            <div className="bg-[#0a1624] p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-1 text-blue-200">
                Version
              </h4>
              <p className="text-xs text-white/60">
                {tg?.version || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-[65px] bg-app-background-primary border-t border-white/10 flex items-center justify-center">
        <div className="flex w-full max-w-[430px] px-4 justify-around">
          <div className="flex flex-col items-center opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-blue-400">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[10px] mt-1 font-medium text-blue-400">
              Home
            </span>
          </div>

          {/* Add other tabs as needed */}
        </div>
      </nav>
    </div>
  );
}

export default App;
