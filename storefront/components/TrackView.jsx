"use client";
import { useEffect } from "react";
import { useRecent } from "@/store/recent";

// Invisible — records this product into "recently viewed" on mount.
export default function TrackView({ product }) {
  const add = useRecent((s) => s.add);
  useEffect(() => {
    if (product?._id) add(product);
  }, [product?._id, add]);
  return null;
}
