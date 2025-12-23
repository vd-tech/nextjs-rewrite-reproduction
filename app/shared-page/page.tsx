import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { DocumentTitle } from "./document-title";

export async function generateMetadata(): Promise<Metadata> {
  const headersStore = await headers();
  const label = headersStore.get("x-route-label") || "Unknown";

  console.log("[generateMetadata] Running with label:", label);

  return {
    title: `${label} Page`,
  };
}

export default async function SharedPage() {
  const headersStore = await headers();
  const label = headersStore.get("x-route-label") || "Unknown";

  console.log("[SharedPage] Rendering with label:", label);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">{label} Page</h1>

      <div className="space-y-2 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          Visible title (from headers): <strong>{label} Page</strong>
        </p>
        <DocumentTitle />
        <p className="text-xs text-red-600 mt-2">
          ⚠️ On client-side navigation: Server executes correctly (check logs),
          but client render tree is stale!
        </p>
      </div>

      <nav className="flex gap-4 pt-4 border-t">
        <Link href="/route-a" className="text-blue-600 hover:underline">
          Route A
        </Link>
        <Link href="/route-b" className="text-blue-600 hover:underline">
          Route B
        </Link>
        <Link href="/route-c" className="text-blue-600 hover:underline">
          Route C
        </Link>
      </nav>
    </div>
  );
}
