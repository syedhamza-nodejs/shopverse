import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-gold-600">404</p>
      <h1 className="mt-2 text-xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-ink-900 px-6 py-3 font-semibold text-gold-400 hover:bg-ink-800">
        Back to Home
      </Link>
    </div>
  );
}
