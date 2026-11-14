"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellRing, X, Check } from "lucide-react";

export default function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permissionState, setPermissionState] = useState<string>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionState(Notification.permission);
      const dismissed = localStorage.getItem("devbexruz_notification_dismissed");
      if (Notification.permission === "default" && !dismissed) {
        // Show after a brief delay so page loads smoothly
        const timer = setTimeout(() => setShowPrompt(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Brauzeringiz bildirishnomalarni qo'llab-quvvatlamaydi.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission === "granted") {
        new Notification("DevBexruz Bildirishnomalari", {
          body: "Bildirishnomalar muvaffaqiyatli faollashtirildi! Sizga yangi yechim va xabarlar yuboriladi.",
          icon: "/favicon.ico",
        });
      }
      setShowPrompt(false);
    } catch (e) {
      console.error(e);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("devbexruz_notification_dismissed", "true");
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl shadow-lg border border-blue-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-3 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <BellRing className="w-5 h-5 text-white animate-bounce" />
        </div>
        <div>
          <h4 className="text-sm font-bold leading-tight">Bildirishnomalarni faollashtiring</h4>
          <p className="text-xs text-blue-100 mt-0.5">
            Yangi muammolar, Stack Overflow uslubidagi yechimlar va xabarlardan birinchilardan bo'lib xabardor bo'ling.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={handleDismiss}
          className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition"
          title="Yopish"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={handleRequestPermission}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Ruxsat berish</span>
        </button>
      </div>
    </div>
  );
}
