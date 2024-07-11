import dynamic from "next/dynamic";

/**
 * Critical: prevents "TypeError: url.replace is not a function" error
 */
const Simple = dynamic(() => import("../components/Simple"), {
  ssr: false,
});

export default function Page() {
  return <Simple />;
}
