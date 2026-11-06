import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { PostArticle } from "@/components/PostArticle";
import { ScrollLink } from "@/components/ScrollLink";
import { getPost, getPosts, getSettings } from "@/lib/content";
import { postMetadata } from "@/lib/seo";
import styles from "./page.module.css";

// A placeholder keeps the build happy before the first post is published; it 404s.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? postMetadata(post) : {};
}

async function Post({ params }: { params: PageProps<"/journal/[slug]">["params"] }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!post) notFound();
  return <PostArticle post={post} phoneE164={settings.phoneE164} />;
}

export default function PostPage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <PageShell>
      <div className={styles.wrap}>
        <ScrollLink to="journal" className={styles.back}>
          All journal posts
        </ScrollLink>
        <Suspense fallback={<div className={styles.loading} />}>
          <Post params={params} />
        </Suspense>
      </div>
    </PageShell>
  );
}
