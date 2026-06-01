"use client";
import { useEffect } from "react";
import { useSettings } from "@/store/settings";
import { API_URL } from "@/lib/api";

// Fetches global settings once on mount and hydrates the settings store.
export default function SettingsLoader() {
  const setData = useSettings((s) => s.setData);
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((r) => r.json())
      .then((d) => d && setData(d))
      .catch(() => {});
  }, [setData]);
  return null;
}
