import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">
        Next.js Route Rewrite Metadata Bug Reproduction
      </h1>
      <p className="text-gray-600">
        Navigate between routes using client-side navigation to see the issue.
      </p>
      <nav className="flex flex-col gap-2 pt-4">
        <Link href="/route-a" className="text-blue-600 hover:underline">
          → Route A
        </Link>
        <Link href="/route-b" className="text-blue-600 hover:underline">
          → Route B
        </Link>
        <Link href="/route-c" className="text-blue-600 hover:underline">
          → Route C
        </Link>
      </nav>
    </div>
  );
}
