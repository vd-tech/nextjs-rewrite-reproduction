"use client";

import { useEffect, useState } from "react";

export function DocumentTitle() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(document.title);

    // Watch for title changes
    const observer = new MutationObserver(() => {
      setTitle(document.title);
    });

    const titleElement = document.querySelector("title");
    if (titleElement) {
      observer.observe(titleElement, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <p className="text-sm text-gray-600">
      Browser tab title (document.title):{" "}
      <strong>{title || "Loading..."}</strong>
      <br />
    </p>
  );
}
