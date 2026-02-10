import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-bold">ajbattista.com</h1>
        <p className="text-lg text-zinc-400">
          Marketing · Tampa, FL
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/hook-grader">
            <Button size="lg" className="rounded-full">
              Open Ad Hook Grader
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
