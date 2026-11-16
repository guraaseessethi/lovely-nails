import { PageShell } from "@/components/PageShell";
import { SalonGallery } from "@/components/SalonGallery";
import { getWorkPhotos } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata("salon");
}

export default async function SalonPage() {
  const all = await getWorkPhotos();
  // Photos of the salon itself: the ones switched on as "Photo of the salon" in the Studio.
  const marked = all.filter((p) => p.salon);
  // Until any are switched on, use the photos ticked "Lovely Nails" and nothing else:
  // the salon shots carry no nail category, while nail sets do.
  const photos = marked.length
    ? marked
    : all.filter((p) => p.categories.length === 1 && p.categories[0] === "Lovely Nails");
  return (
    <PageShell>
      <SalonGallery photos={photos} />
    </PageShell>
  );
}
