import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div>welcome</div>
      <Link href="/sample" className="hover:underline cursor-pointer">
        go to sample
      </Link>
      <Link href="/simple" className="hover:underline cursor-pointer">
        go to simple
      </Link>
    </main>
  );
}
