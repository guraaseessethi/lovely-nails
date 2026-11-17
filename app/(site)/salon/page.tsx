import { PageShell } from "@/components/PageShell";
import { SalonGallery } from "@/components/SalonGallery";
import { getWorkPhotos } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata("salon");
}

export default async function SalonPage() {
  // Only photos of the salon itself: the ones switched on as "Photo of the salon" in the Studio.
  const photos = (await getWorkPhotos()).filter((p) => p.salon);
  return (
    <PageShell>
      <SalonGallery photos={photos} />
    </PageShell>
  );
}
