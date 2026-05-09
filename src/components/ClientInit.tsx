"use client";

import { useEffect } from "react";

export function ClientInit() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/Controle-AEE/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
