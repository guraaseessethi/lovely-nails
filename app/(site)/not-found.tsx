import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="container">
        <p className="eyebrow">Page not found</p>
        <h1 className="h2" style={{ margin: "16px 0 24px" }}>
          This page <span className="accent">has moved.</span>
        </h1>
        <p className="body" style={{ marginBottom: 28 }}>
          Our site was rebuilt, so some old links no longer work. Everything is on the homepage.
        </p>
        <Link href="/" className="btn btnOutline">
          Go to the homepage
        </Link>
      </section>
    </PageShell>
  );
}
