import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Frown className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>
        La page que vous recherchez n'existe pas. Veuillez vérifier l'URL ou
        retourner.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Retour
      </Link>
    </main>
  );
}
