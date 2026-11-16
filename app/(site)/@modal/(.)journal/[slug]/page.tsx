import { notFound } from "next/navigation";
import { PostArticle } from "@/components/PostArticle";
import { PostModal } from "@/components/PostModal";
import { getPost, getPosts, getSettings } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

/** Intercepts /journal/[slug] when a card is clicked on the site, showing it as a modal. */
export default async function PostModalPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!post) notFound();
  return (
    <PostModal title={post.title}>
      <PostArticle post={post} phone={settings.phone} phoneE164={settings.phoneE164} email={settings.email} as="modal" />
    </PostModal>
  );
}
