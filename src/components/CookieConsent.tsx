"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700 p-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-300">
          We use cookies for analytics (Google Analytics, Microsoft Clarity) and
          advertising (Google AdSense). By continuing to use this site, you
          consent to our use of cookies.{" "}
          <a href="/privacy" className="text-yellow-400 hover:underline">
            Learn more
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm text-gray-400 border border-gray-600 rounded hover:border-gray-500 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-400 transition-colors font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
