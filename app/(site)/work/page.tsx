import { PageShell } from "@/components/PageShell";
import { WorkGallery } from "@/components/WorkGallery";
import { getNailPhotos } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata("work");
}

export default async function WorkPage() {
  const photos = await getNailPhotos();
  return (
    <PageShell>
      <WorkGallery photos={photos} headingLevel={1} />
    </PageShell>
  );
}
