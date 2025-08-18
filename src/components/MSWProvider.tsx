"use client";

import { useEffect, useState } from "react";
import { initMocks, isMockingEnabled } from "../mocks";

interface MSWProviderProps {
  children: React.ReactNode;
}

/**
 * MSW Provider Component
 *
 * Initializes Mock Service Worker in development mode when enabled.
 * This component should be placed at the root of your application.
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [isMSWReady, setIsMSWReady] = useState(!isMockingEnabled());

  useEffect(() => {
    async function setupMSW() {
      if (isMockingEnabled()) {
        try {
          await initMocks();
          setIsMSWReady(true);
        } catch (error) {
          console.error("Failed to initialize MSW:", error);
          // Continue without mocks on error
          setIsMSWReady(true);
        }
      }
    }

    setupMSW();
  }, []);

  // Show a loading state while MSW is initializing
  if (!isMSWReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">
            🔧 Initializing Mock Service Worker...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

