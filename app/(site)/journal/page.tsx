import { AskApril } from "@/components/AskApril";
import { Journal } from "@/components/Journal";
import { PageShell } from "@/components/PageShell";
import { getPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata("journal");
}

export default async function JournalPage() {
  const posts = await getPosts();
  return (
    <PageShell>
      {posts.length ? (
        <Journal posts={posts} headingLevel={1} />
      ) : (
        <section className="container">
          <h1 className="h2">
            Notes from <span className="accent">the chair.</span>
          </h1>
          <p className="body" style={{ marginTop: 24 }}>
            <AskApril>the first journal post</AskApril>
          </p>
        </section>
      )}
    </PageShell>
  );
}
