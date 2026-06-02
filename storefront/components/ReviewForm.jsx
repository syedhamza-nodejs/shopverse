"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function ReviewForm({ productId, slug }) {
  const { token } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    try {
      await api(`/products/${productId}/reviews`, {
        method: "POST",
        token,
        body: { rating, comment },
      });
      setMsg("Thank you! Your review has been added.");
      setComment("");
      router.refresh();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-fit rounded-lg border border-ink-100 bg-cream p-5">
      <h3 className="font-display text-lg font-bold">Write a Review</h3>
      {!token ? (
        <p className="mt-2 text-sm text-ink-700/60">
          Please <a href={`/login?redirect=/products/${slug}`} className="font-semibold text-gold-600">sign in</a> to leave a review.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-3">
          <div className="flex gap-1 text-2xl text-gold-500">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="leading-none"
              >
                {n <= (hover || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            required
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience…"
            className="w-full rounded-sm border border-ink-100 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
          />
          {err && <p className="text-sm text-red-500">{err}</p>}
          {msg && <p className="text-sm text-green-700">{msg}</p>}
          <button disabled={loading} className="w-full rounded-sm bg-gold-500 py-2.5 text-sm font-bold uppercase tracking-wider text-ink-900 hover:bg-gold-400 disabled:opacity-60">
            {loading ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
