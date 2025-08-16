import Link from "next/link";
import { BrainIcon } from "@/components/icons";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <BrainIcon className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">BrainDump.io</span>
      </Link>
    </header>
  );
}
