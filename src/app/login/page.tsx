import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionMaritime } from "@/components/ui/SectionMaritime";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Secure client access to the Pelagic Maritime Advisory Platform.",
};

export default function LoginPage() {
  return (
    <SectionMaritime
      as="div"
      className="flex min-h-[75vh] items-center justify-center px-4 py-16"
      gridOpacity={45}
    >
      <div className="card-maritime w-full max-w-md rounded-3xl border p-10 shadow-xl">
        <div className="mb-6 flex justify-center">
          <BrandLogo variant="header" linked={false} compact />
        </div>
        <h1 className="font-display text-center text-2xl font-semibold text-pelagic-ink">
          Client Login
        </h1>
        <p className="mt-3 text-center text-sm text-pelagic-slate">
          Maritime Advisory Platform · coming soon
        </p>

        <form className="mt-8 space-y-4">
          <input
            disabled
            placeholder="Work email"
            className="w-full rounded-xl border border-pelagic-sand bg-white/90 px-4 py-3 text-sm text-pelagic-slate"
          />
          <input
            disabled
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-pelagic-sand bg-white/90 px-4 py-3 text-sm text-pelagic-slate"
          />
          <button
            type="button"
            disabled
            className="w-full rounded-full bg-pelagic-sand py-3 text-sm font-semibold text-pelagic-slate"
          >
            Sign in (coming soon)
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-pelagic-accent"
        >
          ← Back to home
        </Link>
      </div>
    </SectionMaritime>
  );
}
